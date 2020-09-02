import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config();

export const jwtAuth = async (req:any) => {

    const token = req.header('authorization');

    if(!token){

        throw new Error('Access denied. No token provided');
    } 

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY || 'secret');

        req.userId = decoded;
    }
    catch(ex) {
        throw ex;
    } 
}