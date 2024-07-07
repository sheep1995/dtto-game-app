import { Request } from 'express';
import { File } from 'multer';
//import User from './models/User';

declare module 'express' {
    interface Request {
        user?: User;
        staff?: Staff;
        file?: File; // 对应单文件上传
        files?: File[] | { [fieldname: string]: File[] }; // 对应多文件上传
    }
}