export interface RSS {
    id?: number;
    url: string;
    image: string;
}

export const instanceOfRSS = (object: any): object is RSS => {
    return 'url' in object && 'image' in object;
}