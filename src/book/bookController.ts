import { Request, Response, NextFunction } from "express"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import cloudinary from "../config/cloudinary"
import path from "path"
import createHttpError from "http-errors"
import bookModel from "./bookModel"
import fs from 'fs'
import { AuthRequest } from "../middlewares/authenticate"

const createdBook = async(req : Request, res: Response, next: NextFunction)=>{
    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    res.send(files)
    
    try{
    const coverImgMimeType = files.coverImage[0].mimetype.split('/').at(-1)
    const filename = files.coverImage[0].filename
    const filepath =  path.join(__dirname, "../../public/data/uploads",filename) 
    const coverimage=  cloudinary.uploader.upload(filepath, {
        filename_override: filename,
        folder: 'book-covers',
        format: coverImgMimeType
    })
    const fileMimeType = files.file[0].mimetype.split('/').at(-1)
    const pdffilename = files.file[0].filename
    const pdffilepath =  path.join(__dirname, "../../public/data/uploads",pdffilename) 
    const pdffile =  cloudinary.uploader.upload(pdffilepath, {
        resource_type: 'raw',
        filename_override: pdffilename,
        folder: 'book-pdfs',
        format: fileMimeType
    })
    const {title, genre}= req.body
    const _req= req as AuthRequest
    const newBook = await bookModel.create({
        title,
        genre,
        author:_req.userId,
        name:"Book 1",
        coverImage:(await coverimage).secure_url,
        file: (await pdffile).secure_url
    })
    console.log(newBook);
    await fs.promises.unlink(filepath)
    await fs.promises.unlink(pdffilepath)
   
    } catch(err)
    {
        console.log(err);
        return next(createHttpError(404, "Files not uploaded on cloudinary"))
    }
}

const updateBook = async(req : Request, res: Response, next: NextFunction)=>{
  
    const {title, genre, name} =req.body
    const bookId= req.params.id
    const book = await bookModel.findOne({_id: bookId})
    if(!book)
        return next(createHttpError(404,"Book not found."))
    const _req = req as AuthRequest
    if(book.author.toString()!=_req.userId)
        return next(createHttpError(403,"You are forbidden to uodate Book."))
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let fileUrl= "abcd"
    if(files.coverImage)
    {
    const filename = files.coverImage[0].filename 
    const filePath = path.join(files.coverImage[0].destination,filename)
    const converMimeType = files.coverImage[0].mimetype.split('/').at(-1)
    const uploadResult = await cloudinary.uploader.upload(filePath, {
    filename_override: filename,
    folder: "book-covers",
    format: converMimeType,
    });
   
    fileUrl = uploadResult.secure_url 
    await fs.promises.unlink(filePath);
    }
    let pdfurl="abcd"
    if(files.file){
        const pdfname = files.file[0].filename
        const bookFilePath = path.join(files.file[0].destination,pdfname)
        const pdfMimType = files.file[0].mimetype.split('/').at(-1)
        const uploadResultPdf = await cloudinary.uploader.upload(bookFilePath, {
            resource_type: "raw",
            filename_override: pdfname,
            folder: "book-pdfs",
            format: pdfMimType,
        });
         pdfurl= uploadResultPdf.secure_url
        await fs.promises.unlink(bookFilePath);
    }

    const updatedBook = await bookModel.findOneAndUpdate(
        {_id:bookId},
        {
            name,
            title,
            genre,
            coverImage: pdfurl? pdfurl: book.coverImage,
            file: fileUrl? fileUrl: book.file
        },
        {new : true}
    )

    res.json(updatedBook)
}

const getOneBook= async(req : Request, res: Response, next: NextFunction)=>{
   const bookId = req.params.bookId
   const book = await bookModel.findOne({_id: bookId})
   if(!book)
    return next(createHttpError(400,"Book not found."))
   res.send(book)
}
const getAllBook = async(req : Request, res: Response, next: NextFunction)=>{
   const book = await bookModel.find()
   if(!book)
    return next(createHttpError(404,"Book not found."))
   res.send(book)
}       

const deleteBook = async(req : Request, res: Response, next: NextFunction)=>{
    const bookId = req.params.id
    const book = await bookModel.findOne({_id: bookId})
    if(!book)
        return next(createHttpError(404,"Book not found."))
    const _req = req as AuthRequest
    if(book.author.toString()!=_req.userId)
        return next(createHttpError(403,"You are not authorised to delete the book."))
    const coverImageSplit = book.coverImage.split('/')
    const coverImagePublicId = coverImageSplit.at(-2)+'/'+coverImageSplit.at(-1)?.split('.').at(-2)
    await cloudinary.uploader.destroy(coverImagePublicId);
    const bookFileSplits = book.file.split("/");
    const bookFilePublicId =
        bookFileSplits.at(-2) + "/" + bookFileSplits.at(-1);
        await cloudinary.uploader.destroy(bookFilePublicId, {
    resource_type: "raw",
    });
    await bookModel.deleteOne({_id:bookId})
    res.send({message: `${bookId} deleted successfully`})
}
export {createdBook, updateBook, getOneBook, getAllBook, deleteBook}