<script lang="ts">
	import type { Artist, Track } from "$lib/models/Spotify";
	import { spotifyService } from "$lib/spotify";
	import { onMount } from "svelte";
    let access_token = localStorage.getItem("access_token");
    let refresh_token = localStorage.getItem("refresh_token");
    let expires_at = localStorage.getItem("expires_at");
    let artists:Artist[] = [];
    let songs:Track[] = [];
    let currentTab : 'artists' | 'tracks' = 'tracks'
    onMount(async () => {
        let expiryDate = new Date(parseInt(expires_at!));
        let now = new Date();

        console.log(expiryDate, now)
        if(access_token && refresh_token && expiryDate < now){
          await spotifyService.refreshAccessToken(refresh_token)
        }
        artists = await spotifyService.getUserTopArtists();
        songs = await spotifyService.getUserTopTracks();
        console.log(artists, songs)
    })  

</script>

<div class="wrapper">
    <div class="header">
		<div class="options" class:active={currentTab === 'artists'} on:click={() => (currentTab = 'artists')} on:keydown={(e) => { if (e.key === 'Enter') currentTab = 'artists'; }}>
			<span class="material-symbols-outlined"> group </span>
		</div>
		<div class="options" class:active={currentTab === 'tracks'} on:click={() => (currentTab = 'tracks')} on:keydown={(e) => { if (e.key === 'Enter') currentTab = 'tracks'; }}>
			<span class="material-symbols-outlined"> library_music </span>
		</div>
	</div>
    {#if currentTab == 'artists'}
        {#each artists as artist}
            <div class="artist" on:click={() => window.open(artist.external_urls.spotify, "_blank")} on:keydown={() => window.open(artist.external_urls.spotify, "_blank")}>
                <img src={artist.images[0].url} alt={artist.name}/>
                <div class="info">
                    <div class="name">{artist.name}</div>
                    <div class="genres">
                        {#each artist.genres as genre}
                            <div class="genre">{genre}</div>
                        {/each}
                    </div>
                </div>
            </div>
        {/each} 
    {:else}
        {#each songs as song}
            <div class="song" on:click={() => window.open(song.external_urls.spotify, "_blank")} on:keydown={() => window.open(song.external_urls.spotify, "_blank")}>
                <img src={song.album.images[0].url} alt={song.name}/>
                <div class="info">
                    <div class="name">{song.name}</div>
                    <div class="genres">
                        {#each song.artists as artist}
                            <div class="genre">{artist.name}</div>
                        {/each}
                    </div>
                </div>
            </div>
        {/each} 
    {/if}
    
</div>

<style lang="scss">
    .wrapper{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        overflow: auto;
        position: relative;
        gap: 10px;
        padding: 10px;
    }


    .artist {
        width: 95%;
        font-size: 1.5rem;
        height: auto;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
        background-color: var(--accent-color);
        color: var(--text-color);
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        padding: 10px;
        gap: 10px;
        cursor: pointer;
        &:hover{
            background-color: var(--accent-color-hover);
            color: var(--text-color-hover);
        }
        img{
            width: 60px;
            height: 60px;
            min-width: 60px;
            min-height: 60px;
            object-fit: cover;
        }
        .info{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 5px;
        width: 100%;
        height: 100%;
        .name{
            font-size: 1.5rem;
            font-weight: bold;
        }
        .genres{
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;    
            align-items: flex-start;
            flex-wrap: wrap;
            gap: 5px;
            .genre{
                font-weight: 200;
                font-size: 0.8rem;
            }
        }
    }
    }

    .song{
        width: 95%;
        font-size: 1rem;
        height: auto;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
        background-color: var(--accent-color);
        color: var(--text-color);
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        padding: 10px;
        gap: 10px;
        cursor: pointer;
        &:hover{
            background-color: var(--accent-color-hover);
            color: var(--text-color-hover);
        }
        img{
            width: 50px;
            height: 50px;
            min-width: 50px;
            min-height: 50px;
            object-fit: cover;
        }
        .info{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 5px;
        width: 100%;
        height: 100%;
        .name{
            font-size: 1rem;
            font-weight: bold;
        }
        .genres{
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;    
            align-items: flex-start;
            flex-wrap: wrap;
            gap: 5px;
            .genre{
                font-weight: 200;
                font-size: 0.8rem;
            }
        }
    }
    }



    .header {
		display: flex;
		justify-content: space-around;
		align-items: center;
		width: 100%;
		min-height: 20px;
		background-color: transparent;
	}

	.options {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 40%;
		height: 20px;
		margin-right: 5px;
		background-color: var(--icon-background);
		color: var(--icon-color) !important;
		text-align: center;
        border-radius: 5px;
		cursor: pointer;
		transition: color 0ms;
		&.active {
			background-color: var(--icon-background-active);
			color: var(--icon-color-active) !important;
		}
		&:hover {
			background-color: var(--icon-background-hover);
			color: var(--icon-color-hover) !important;
		}
		

		.material-symbols-outlined {
			font-variation-settings: 'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 48;
			font-size: 15px;
			margin: auto;
			user-select: none; /* Non-prefixed version, currently
							supported by Chrome and Opera */
			
		}
	}

</style>