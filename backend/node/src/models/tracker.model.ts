export interface Tracked{
    id?: number;
    title: string;
    currentEpisode: number;
    totalEpisodes?: number;
    url?: string;
    image?: string;
    status?: string;
    displayTitle?: string;
}