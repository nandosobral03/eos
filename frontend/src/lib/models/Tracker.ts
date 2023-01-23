export interface Tracked{
    id: number;
    title: string;
    currentEpisode: number;
    totalEpisodes?: number;
    url: string;
    image: string;
    status: string;
    displayTitle: string;
}

export interface TrackerForUpdate{
    id: number;
    totalEpisodes: number;
    displayTitle: string;
    image: string;
    status: string;
}
