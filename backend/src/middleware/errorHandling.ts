import {Request, Response, NextFunction} from 'express';
import { error } from 'node:console';

const errorHandling = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err);
    res.status(500).json({ status:500, message: 'Internal server error' , error: err.message });
};

export default errorHandling;