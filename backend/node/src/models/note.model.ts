export interface Note {
    id?: number;
    title: string;
    content: string;
    date: string;
}

export const instanceOfNote = (object: any): object is Note => {
    return 'title' in object && 'content' in object && 'date' in object;
}