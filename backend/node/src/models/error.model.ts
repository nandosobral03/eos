export interface HTTPError {
    status: number;
    message: string;
}


export const instanceOfHTTPError = (object: any): object is HTTPError => {
    return 'status' in object && 'message' in object;
}

export const handleHTTPError = (error: any): HTTPError => {
    if (instanceOfHTTPError(error)) {
        return error;
    }
    return {
        status: 500,
        message: `Internal Server Error \n\n error: ${error}`
    }
}