import type { Bookmark, Note, RSSProvider } from '$lib/models/ServerData';
import type { Tracked } from '$lib/models/Tracker';
import { writable, type Writable } from 'svelte/store';

export const notes: Writable<Note[]> = writable([]);
export const bookmarks: Writable<Bookmark[]> = writable([]);
export const rss: Writable<RSSProvider[]> = writable([]);
export const tracked: Writable<Tracked[]> = writable([]);
export const themes : Writable<{
    id:string,
    title: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    theme:any}[]> = writable([])

export const currentlyPlaying: Writable<boolean> = writable(false);

export const currentNote: Writable<{ content: string, writing: boolean, }> = writable(
    {
        content: '',
        writing: false,
    }
);

export const refreshBackground: Writable<number> = writable(0);
export const refreshBottom: Writable<boolean> = writable(false);






function createBottomComponentStore() {
    const {set, subscribe } = writable('single-image');
    function customSet(value: string) {
        set(value)
        const settings = localStorage.getItem('settings')
        if(settings){
            const parsed = JSON.parse(settings)
            parsed.bottomComponent = value
            localStorage.setItem('settings', JSON.stringify(parsed))
        }else{
            localStorage.setItem('settings', JSON.stringify({bottomComponent: value}))
        }
}
    return {
      subscribe,
      set:customSet,
    };
  }

export const bottomComponent = createBottomComponentStore();

function createTabsComponentStore() {
    const {set, subscribe } = writable([]) as Writable<{
        name: string,
        shown: boolean,
    }[]>;
    function customSet(value: {
        name: string,
        shown: boolean,
    }[]) {
        set(value)
        const settings = localStorage.getItem('settings')
        if(settings){
            const parsed = JSON.parse(settings)
            parsed.tabs = value
            localStorage.setItem('settings', JSON.stringify(parsed))
        }else{
            localStorage.setItem('settings', JSON.stringify({tabs: value}))
        }
    }



    return {
      subscribe,
      set:customSet,
    };
  }

export const tabs = createTabsComponentStore();