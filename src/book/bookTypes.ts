import { User } from "../user/userTypes";

export default interface Book{
    title: string;
    name: string;
    author: User;
    genre:string;
    coverImage: string;
    file: string;
    createdAt: Date;
    updatedAt: Date;
}