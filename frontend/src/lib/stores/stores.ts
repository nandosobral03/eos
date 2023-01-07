import type { Bookmark, Note, RSSProvider } from '$lib/models/ServerData';
import { writable, type Writable } from 'svelte/store';

export const notes: Writable<Note[]> = writable([]);
export const bookmarks : Writable<Bookmark[]> = writable([]);
export const rss : Writable<RSSProvider[]> = writable([]);