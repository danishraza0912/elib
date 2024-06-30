import { Request, Response, NextFunction } from "express"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import cloudinary from "../config/cloudinary"
import path from "path"
import createHttpError from "http-errors"
import bookModel from "./bookModel"
import fs from 'fs'

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
    const newBook = await bookModel.create({
        title,
        genre,
        author:"66802a8823d4c0360cba8729",
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

export default createdBook