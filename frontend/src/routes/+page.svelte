<script lang="ts">
	import type { Bookmark, Note, RSSProvider } from "$lib/models/ServerData";
	import { bookmarks, notes, rss } from "$lib/stores/stores";
	import Multicomponent from "./MultiComponent.svelte";
    import Rssfeed from "./RSSFeed.svelte";
    import Toast from "./common/toast.svelte";
	import BottomComponent from "./bottomComponent.svelte";
    export let data:{
        rss: Array<RSSProvider>
        notes: Array<Note>
        bookmarks: Array<Bookmark>       
    };
    notes.set(data.notes);
    bookmarks.set(data.bookmarks);
    rss.set(data.rss);
</script>
<main class="main">
    <Rssfeed/>
    <div class="right-component">
        <Multicomponent/>
        <BottomComponent/>
    </div>
    <Toast />
</main>

<style lang="scss">
    .main{
        height: clamp(600px, 100vh, 100vh);
        width: clamp(1000px, 100vw, 100vw);
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 40px;
        overflow: auto;
    }

    .right-component{
        width: clamp(300px, 40vw, 450px);
        height: clamp(500px, 90vh, 800px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 20px;
    }

</style>