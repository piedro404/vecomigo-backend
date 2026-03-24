import { User } from "./user.types.js";

export type Chat = {
    id: string;
    user: User;
    message: string;
    createdAt: number;
};
