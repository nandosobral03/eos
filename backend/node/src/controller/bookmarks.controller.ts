import { Request, Response } from "express";
import { handleHTTPError } from "../models/error.model";
import { instanceOfBookmark } from "../models/bookmark.model";
import repo from "../repository/bookmarks.repository";

export const getBookmarks = async (req: Request, res: Response) => {
    try {
        const bookmarks = await repo.getBookmarks();
        res.status(200).send(bookmarks);
    } catch (error) {
        let err = handleHTTPError(error);
        res.status(err.status).send(err.message);
    }   
}

export const createBookmark = async (req: Request, res: Response) => {
    try{
        if(!instanceOfBookmark(req.body)){
            throw {
                status: 400,
                message: "Invalid bookmark"
            }
        }
        const id = await repo.createBookmark(req.body);
        res.status(201).send({id, message: "Bookmark created"});
    } catch (error) {
        let err = handleHTTPError(error);
        res.status(err.status).send(err.message);
    }
}

export const deleteBookmark = async (req: Request, res: Response) => {
    try{
        let id = parseInt(req.params.id);
        await repo.deleteBookmark(id);
        res.status(204).send(
            {
                message: "Bookmark deleted"
            }
        );
    }
    catch(error){
        let err = handleHTTPError(error);
        res.status(err.status).send(err.message);
    }
}

export const updateBookmark = async (req: Request, res: Response) => {
    try{
        let id = parseInt(req.params.id);
        if(!instanceOfBookmark(req.body)){
            throw {
                status: 400,
                message: "Invalid bookmark"
            }
        }
        await repo.updateBookmark(id, req.body);
        res.status(204).send({
            message: "Bookmark updated"
        });
    }
    catch(error){
        let err = handleHTTPError(error);
        res.status(err.status).send(err.message);
    }
}