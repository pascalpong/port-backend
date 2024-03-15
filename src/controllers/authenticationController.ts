import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient, Serials } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const checkSerial = async (req: Request, res: Response) => {
    try { 
        const { serial } = req.body;
        const result = await prisma.serials.findUnique({
            where: {
                serial
            }
        }) as Serials;
        if (result) {
            const token = jwt.sign({ data: result }, process.env.JWT_SECRET as string, { expiresIn: '24h' }) 
            return res.status(200).json({
                data: { ...result, token }, 
                message: 'Serial is valid' 
            });
        } else {
            return res.status(404).json({
                data: { token: null }, 
                message: 'Serial is invalid' 
            });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const generateSerial = async (req: Request, res: Response) => {
    try {
        const { userId, receiver } = req.body;
        const serial = uuidv4();

        const serialInfo = await prisma.serials.create({
            data: {
                serial,
                userId,
                receiver
            }
        });

        return res.status(200).json({ serial: serialInfo});

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const createUser = async (req: Request, res: Response) => {
    try {
        const { username, password, email, name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.users.create({
            data: {
                email,
                name,
                username,
                password: hashedPassword
            }
        });

        return res.status(200).json({ user });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const user = await prisma.users.findUnique({
            where: {
                username
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password); 

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
            expiresIn: '24h' // Token expires in 1 hour
        });

        return res.status(200).json({ 
            message: 'Login successful',
            token,
            data: user
        });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};