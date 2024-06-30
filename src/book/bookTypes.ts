import { User } from "../user/userTypes";

export default interface Book{
    _id: string;
    title: string;
    name: string;
    author: User;
    genre:string;
    coverImage: string;
    file: string;
    createdAt: Date;
    updatedAt: Date;
}