import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';


export const login = (req: Request, res: Response) => {
    const correctPassword = process.env.PASSWORD;
    const secret = process.env.JWT_SECRET;
    const { password } = req.body;
    if (password === correctPassword) {
        const token = jwt.sign({} , secret!,);
        res.status(200).json({ token });
    }
    else {
        res.status(401).json({ message: "Incorrect password" });
    }

}

export default { login};