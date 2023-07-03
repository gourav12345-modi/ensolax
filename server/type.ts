import * as Express from 'express';
import { Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    password: string;
    email: string;
}

// It is for JWT payload
export interface IUserPayload {
    id: IUser['_id'];
    name: IUser['name'];
    email: IUser['email'];
}

export interface AuthRequest extends Express.Request {
    user: IUserPayload;
}

export interface IPost extends Document {
    description: string;
    images: string[];
    author: IUser['_id'];
}

export interface IComment extends Document {
    description: string,
    images: string[],
    author: IUser['_id'],
}