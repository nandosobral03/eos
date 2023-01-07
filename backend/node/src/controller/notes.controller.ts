import { Request, Response } from "express";
import { handleHTTPError } from "../models/error.model";
import { instanceOfNote } from "../models/note.model";
import repo from "../repository/notes.repository";

export const getNotes = async (req: Request, res: Response) => {
    try {
        const notes = await repo.getNotes();
        res.status(200).json(notes);
    } catch (error) {
        let err = handleHTTPError(error);
        res.status(err.status).send(err.message);
    }
}

export const createNote = async (req: Request, res: Response) => {
    try {
        if (!instanceOfNote(req.body)) {
            throw { status: 400, message: "Invalid note" }
        }
        const id = await repo.createNote(req.body);
        res.status(201).json({
            message: "Note created",
            id
        });
    } catch (error) {
        let err = handleHTTPError(error);
        res.status(err.status).send(err.message);
    }
}

export const updateNote = async (req: Request, res: Response) => {
    try {
        if (!instanceOfNote(req.body)) {
           throw { status: 400, message: "Invalid note"}
        }
        let id = parseInt(req.params.id);
         repo.updateNote(id, req.body);
        res.status(200).json({
            message: "Note updated",
        });
    } catch (error) {
        let err = handleHTTPError(error);
        res.status(err.status).send(err.message);
    }
}

export const deleteNote = async (req: Request, res: Response) => {
    try {
        console.log(req.params)
        let id = parseInt(req.params.id);
        console.log(id)
        await repo.deleteNote(id);
        res.status(200).json({
            message: "Note deleted",
        });
    } catch (error) {
        let err = handleHTTPError(error);
        res.status(err.status).send(err.message);
    }
}

