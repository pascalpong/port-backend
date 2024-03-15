import { Response } from "express";
import { PrismaClient, Projects } from '@prisma/client';
import { RequestWithUser } from "../models/general";
const prisma = new PrismaClient();

export const getProjects = async(req: RequestWithUser, res: Response) => {
    try {
        const projects = await prisma.projects.findMany({
            where: {
                userId: req.user?.id
            }
        });
        return res.status(200).json({ data: projects });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const createProjects = async(req: RequestWithUser, res: Response) => {
    try {
        let creatingString = [];
        const creatingProjects = req.body;

        creatingProjects.map((project: Projects) => {
            const { title, type, technologies, deployment, database, username, password, url } = project; 
            const data = {
                title, 
                userId: req.user?.id, 
                type, 
                url, 
                technologies: JSON.stringify(technologies), 
                deployment: JSON.stringify(deployment), 
                database: JSON.stringify(database), 
                username, 
                password 
            }
            creatingString.push(data);
        })

        const projects = await prisma.projects.createMany({
            data: creatingString
        }); 

        return res.status(200).json({data: projects});
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}
