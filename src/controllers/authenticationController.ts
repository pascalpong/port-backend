import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const checkSerial = (req: Request, res: Response) => {
    try { 
        const { serial } = req.body;
        if (serial === '123456') {
            return res.status(200).json({ message: 'Serial is valid' });
        } else {
            return res.send('Serial is invalid');
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const generateSerial = async (req: Request, res: Response) => {
    try {
        const { user_id, receiver } = req.body;
        const serial = uuidv4();

        const serialInfo = await prisma.serials.create({
            data: {
                serial,
                user_id,
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
        const passwordMatch = await bcrypt.compare(password, user.password); 

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ 
            message: 'Login successful',
            data: user
        });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}