export interface Track {
	album: Album;
	artists: Artist[];
	available_markets: string[];
	disc_number: number;
	duration_ms: number;
	explicit: boolean;
	external_ids: ExternalIds;
	external_urls: ExternalUrls;
	href: string;
	id: string;
	is_local: boolean;
	name: string;
	popularity: number;
	preview_url: string;
	track_number: number;
	type: string;
	uri: string;
}

export interface ExternalUrls {
	spotify: string;
}

export interface Artist {
	external_urls: ExternalUrls;
	href: string;
	id: string;
	name: string;
	type: string;
	uri: string;
}

export interface Image {
	height: number;
	url: string;
	width: number;
}

export interface Album {
	album_type: string;
	artists: Artist[];
	available_markets: string[];
	external_urls: ExternalUrls;
	href: string;
	id: string;
	images: Image[];
	name: string;
	release_date: string;
	release_date_precision: string;
	total_tracks: number;
	type: string;
	uri: string;
}

export interface Artist {
	external_urls: ExternalUrls;
	href: string;
	id: string;
	name: string;
	type: string;
	uri: string;
}

export interface ExternalIds {
	isrc: string;
}

export interface Artist {
	external_urls: ExternalUrls;
	followers: Followers;
	genres: string[];
	href: string;
	id: string;
	images: Image[];
	name: string;
	popularity: number;
	type: string;
	uri: string;
}

export interface Followers {
	href?: unknown;
	total: number;
}

export interface Image {
	height: number;
	url: string;
	width: number;
}

export interface Device {
	id: string;
	is_active: boolean;
	is_private_session: boolean;
	is_restricted: boolean;
	name: string;
	type: string;
	volume_percent: number;
}

export interface Context {
	external_urls: ExternalUrls;
	href: string;
	type: string;
	uri: string;
}

export interface Artist {
	external_urls: ExternalUrls;
	href: string;
	id: string;
	name: string;
	type: string;
	uri: string;
}

export interface Image {
	height: number;
	url: string;
	width: number;
}

export interface Album {
	album_type: string;
	artists: Artist[];
	available_markets: string[];
	external_urls: ExternalUrls;
	href: string;
	id: string;
	images: Image[];
	name: string;
	release_date: string;
	release_date_precision: string;
	total_tracks: number;
	type: string;
	uri: string;
}

export interface ExternalIds {
	isrc: string;
}


export interface Item {
	album: Album;
	artists: Artist[];
	available_markets: string[];
	disc_number: number;
	duration_ms: number;
	explicit: boolean;
	external_ids: ExternalIds;
	external_urls: ExternalUrls;
	href: string;
	id: string;
	is_local: boolean;
	name: string;
	popularity: number;
	preview_url: string;
	track_number: number;
	type: string;
	uri: string;
}

export interface Actions {
	disallows: {
		[key: string]: boolean
	}
}

//disallows can be indexed by string





export interface PlayBackState {
	device: Device;
	shuffle_state: boolean;
	repeat_state: string;
	timestamp: number;
	context: Context;
	progress_ms: number;
	item: Item;
	currently_playing_type: string;
	actions: Actions;
	is_playing: boolean;
}
