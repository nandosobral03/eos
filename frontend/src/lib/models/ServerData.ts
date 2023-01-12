export interface RSSProvider {
	id?: number;
	url: string;
	image: string;
}

export interface Note {
	id?: number;
	title: string;
	content: string;
	date: string;
}

export interface Bookmark {
	id?: number;
	title: string;
	color: string;
	links: Array<{ name: string; url: string }>;
}
