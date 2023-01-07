export interface Bookmark { 
    id?: number;
    title: string;
    color: string;
    links: BookmarkLink[];
}

export interface BookmarkLink {
    id?: number;
    name: string;
    url: string;
}

const instanceOfBookmarkLink = (object: any): object is BookmarkLink => {
    return 'name' in object && 'url' in object;
}


export const instanceOfBookmark = (object: any): object is Bookmark => {
    return 'title' in object && 'color' in object && 'links' in object && Array.isArray(object.links) && object.links.every(instanceOfBookmarkLink);
}