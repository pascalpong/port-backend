import { Users } from '@prisma/client';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { RequestWithUser } from '../models/general';
 

const authentication: express.RequestHandler = (req: RequestWithUser, res: Response, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET as string, (err, user: Users) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

export default authentication;