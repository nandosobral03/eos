import type { Bookmark, Note, RSSProvider } from '$lib/models/ServerData';
import { writable, type Writable } from 'svelte/store';

export const notes: Writable<Note[]> = writable([]);
export const bookmarks: Writable<Bookmark[]> = writable([]);
export const rss: Writable<RSSProvider[]> = writable([]);
export const currentNote: Writable<{ content: string, writing: boolean, }> = writable(
    {
        content: '',
        writing: false,
    }
);

export const refreshBackground: Writable<boolean> = writable(false);
export const refreshBottom: Writable<boolean> = writable(false);
