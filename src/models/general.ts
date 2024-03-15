import { Users } from "@prisma/client";
import { Request } from "express";

export interface RequestWithUser extends Request {
    user?: Users;
}