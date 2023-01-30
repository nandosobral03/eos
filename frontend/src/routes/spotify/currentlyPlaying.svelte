<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import {spotifyService} from '$lib/spotify';
	import type { PlayBackState } from '$lib/models/Spotify';

    let show_player = false;
    let current_track: PlayBackState;
    let current_track_progress = 0;
    let current_track_duration = 1;
    let currentInterval : any = null;
    onMount(async () => {
        await setCurrentTrack();
    })


    onDestroy(() => {
        if(currentInterval){
            clearInterval(currentInterval);
        }
    })

    $: progress = (current_track_progress / current_track_duration) * 100;

    const setCurrentTrack = async () => {
        const refresh_token = localStorage.getItem('refresh_token');
        if(refresh_token){
            await spotifyService.refreshAccessToken(refresh_token);
        }
        const response:PlayBackState&{ is_playing: boolean} = await spotifyService.getCurrentlyPlaying();

        current_track = response;
        show_player = response.is_playing ?? false;
        if(!show_player){
            setTimeout(() => {
                setCurrentTrack();
            }, 30000);
            return;
        }else{
            actions.forEach(a => a.allow = true);
            current_track_duration = response.item?.duration_ms ?? 1;
            current_track_progress = response.progress_ms ?? 0;

            if(currentInterval){
                clearInterval(currentInterval);
            }

            if(response.is_playing && response.actions){
                for(let action of Object.keys(response.actions.disallows)){
                    let action_index = actions.findIndex(a => a.action === action);
                    if(action_index > -1){
                        actions[action_index].allow = false;
                    }
                }
            }

            if(actions.find(a => a.action === "pausing")!.allow && response.is_playing){
                currentInterval = setInterval(async () => {
                if(show_player){
                    current_track_progress += 5000;
                    if(current_track_progress >= current_track_duration){
                        setTimeout(() => {
                            setCurrentTrack();
                        }, 1000);
                    }
                }
            }, 5000);
            }
        }
    }

    let actions = [{
        action: "skipping_prev",
        icon: "skip_previous",
        allow: true,
        click: async () => {
            await spotifyService.skipToPrevious();
            setTimeout( async () => {
                await setCurrentTrack();
            }, 1000);
            
        } 
    },{
        action: "resuming",
        icon: "play_arrow",
        allow: true,
        click: async () => {
            await spotifyService.startPlayback();
            setTimeout( async () => {
                await setCurrentTrack();
            }, 1000);
        }
    },
    {
        action: "pausing",
        icon: "pause",
        allow: true,
        click: async () => {
            await spotifyService.pausePlayback();
            setTimeout( async () => {
                await setCurrentTrack();
            }, 1000);
        }
    },
    {
        action: "skipping_next",
        icon: "skip_next",
        allow: true,
        click: async () => {
            await spotifyService.skipToNext();
            setTimeout( async () => {
                await setCurrentTrack();
            }, 1000);
        }
    },
    ]

    const closePlayer = () =>{
        show_player = false;
        setTimeout(async () => {
            await setCurrentTrack();
        }, 30 * 60 * 1000);
    }
</script>

{#if show_player && current_track.item}
    <div class="player">
        <div class="progress">
            <div class="progress_bar" style={`width: ${progress}%`}></div>
        </div>
        <div class="album">
            <img src="{current_track.item.album.images[0].url}" alt="Currently playing album">
        </div>
        <div class="details_actions">
            <div class="details">
                <div class="title"><span>{current_track.item.name}</span> <span class="material-symbols-outlined close" on:click={closePlayer} >close</span></div>
                <span class="artists">
                    {#each current_track.item.artists as artist, i}
                        {artist.name} {i < current_track.item.artists.length - 1 ? ', ' : ''}
                    {/each}
                </span>
            </div>
            <div class="actions">
                {#each actions as action}
                {#if (action.allow)}
                    <button on:click={action.click} 
                    ><i class="material-symbols-outlined">{action.icon}</i></button>
                {/if}    
                {/each}
            </div> 
        </div>
    </div>
{/if}

<style lang="scss">
    .player{
        background-color: black;
        color: white;
        
        height: clamp(120px, 15%, 240px);
        aspect-ratio: 12/3;
        position: absolute;
        bottom: clamp(5px, 3%, 30px);
        left: clamp(5px, 3%, 30px);
        display: flex;
        flex-direction: row;
    }

    .album{
        height: clamp(120px, 100%, 240px);
        aspect-ratio: 1/1;
        img{
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .details_actions{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 10px;
        flex: 1;;
        .details{
            display: flex;
            flex-direction: column;
            .title{
                font-size: 1rem;
                font-weight: bold;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
            }
            .artists{
                font-size: 0.8rem;
                font-weight: 200;
            }
        }
        .actions{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding: 0px 15px;
            button{
                background-color: transparent;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                .material-symbols-outlined {
                        font-variation-settings: 'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 48;
                        font-size: 25px;
                        margin: auto;
                        user-select: none; 
                }
                &:hover{
                    .material-symbols-outlined {
                        font-variation-settings: 'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 48;
                        font-size: 25px;
                        margin: auto;
                        user-select: none; 
                        color: #1db954;
                    }
                }

            }
        }
    }

    .progress{
        position: absolute;
        top: 0;
        left: 0;
        height: 5px;
        width: 100%;
        .progress_bar{
            height: 100%;
            max-width: 100%;
            background-color: #1db954;
            transition:width 6s linear;
        }
    }

    .close{
        cursor: pointer;
        &:hover{
            color: var(--danger-color);
        }
    }

</style>