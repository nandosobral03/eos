import { Request, Response } from "express";
import repo from "../repository/rss.repository";
import { handleHTTPError } from "../models/error.model";
import { instanceOfRSS } from "../models/RSS.model";
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



