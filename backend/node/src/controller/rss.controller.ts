import { Request, Response } from "express";
import repo from "../repository/rss.repository";
import { handleHTTPError } from "../models/error.model";
import { instanceOfRSS } from "../models/rss.model";

export const getRSS = async (req: Request, res: Response) => {
    try {
        const rss = await repo.getRSS();
        res.status(200).send(rss);
    } catch (error) {
        let err = handleHTTPError(error);
        res.status(err.status).send(err.message);
    }   
}

export const createRSS = async (req: Request, res: Response) => {
    try{
        if(!instanceOfRSS(req.body)){
            throw {
                status: 400,
                message: "Invalid RSS"
            }
        }
        const id = await repo.createRSS(req.body);
        res.status(201).send({id, message: "RSS created"});
    } catch (error) {
        let err = handleHTTPError(error);
        res.status(err.status).send(err.message);
    }
}

export const deleteRSS = async (req: Request, res: Response) => {
    try{
        let id = parseInt(req.params.id);
        await repo.deleteRSS(id);
        res.status(204).send(
            {
                message: "RSS deleted"
            }
        );
    }
    catch(error){
        let err = handleHTTPError(error);
        res.status(err.status).send(err.message);
    }
}

export const updateRSS = async (req: Request, res: Response) => {
    try{
        let id = parseInt(req.params.id);
        if(!instanceOfRSS(req.body)){
            throw {
                status: 400,
                message: "Invalid RSS"
            }
        }
        await repo.updateRSS(id, req.body);
        res.status(204).send({
            message: "RSS updated"
        });
    }
    catch(error){
        let err = handleHTTPError(error);
        res.status(err.status).send(err.message);
    }
}


//receive the file from the client via http request, save it in the ./images folder
//validate file is an image
export const updateRSSImage = async (req: Request, res: Response) => {
    try{
        let id = parseInt(req.params.id);
        console.log(req.files);
        if(!req.files){
            throw {
                status: 400,
                message: "Invalid file"
            }
        }
        if (!req.files || Object.keys(req.files).length === 0 || !req.files.image) {
            res.status(400).send({message:"No files were uploaded"});
            return
        }
        let image = req.files.image as { data: Buffer, name: string, size: number, mimetype: string, md5: string };
        if(!image.mimetype.startsWith("image/")){
            throw {
                status: 400,
                message: "Invalid file"
            }
        }
        await repo.updateRSSImage(id, image);
        res.status(200).json({
            message: "Image updated"
        });
    }
    catch(error){
        let err = handleHTTPError(error);
        res.status(err.status).send(err.message);
    }
}


export const createMassRSS = async (req: Request, res: Response) => {
    try{
        if(!Array.isArray(req.body)){
            throw {
                status: 400,
                message: "Invalid RSS"
            }
        }
        const id = await repo.createMassRSS(req.body);
        res.status(201).send({id, message: "RSS created"});
    } catch (error) {
        let err = handleHTTPError(error);
        res.status(err.status).send(err.message);
    }
}