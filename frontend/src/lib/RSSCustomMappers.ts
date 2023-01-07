import type { FeedEntry } from "@extractus/feed-extractor";
//allow string indexing for ts
const customMappers: { [key: string]: (entry: FeedEntry) => FeedEntry } = {
    // Hackernews link to comments rather than article
    "https://hnrss.org/frontpage": (entry: FeedEntry) => {
        return {
            ...entry,
            link: entry.link?.match(/https:\/\/news.ycombinator.com\/item\?id=\d+/)?.[0] || entry.description?.match("https://news.ycombinator.com/item\\?id=\\d+")?.[0] || entry.link,
            title: `${entry.title} ${entry.description?.match("Points: \\d+")?.[0].replace("Points: ","- ") || ""}`,
        }
    
    }
}

export default customMappers;