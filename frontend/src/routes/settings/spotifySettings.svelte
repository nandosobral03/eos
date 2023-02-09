<script lang="ts">
	import { spotifyService } from "$lib/spotify";
	import { currentlyPlaying } from "$lib/stores/stores";

    let timeRange = 'short_term';
    let allowPlayer = false;
    currentlyPlaying.subscribe(x => {
        allowPlayer = x;
    })
	
    const setCurrentlyPlaying = () =>{
        allowPlayer = !allowPlayer;
        currentlyPlaying.set(allowPlayer);
        localStorage.setItem('allowCurrentlyPlaying', allowPlayer.toString());
    }


</script>

<div class="wrapper">
    <div class="wrapper">
        <div class="setting">
            <div class="setting-title">
                Stats
            </div>
            <div class="setting-list">
                <div class="setting-item">
                    <span class="setting-item-title">Time range</span>
                    <div class="setting-item-value">
                        <select class="action_button" bind:value={timeRange} on:change={() => {spotifyService.term.set(timeRange)}}>
                            <option value="short_term">Last month</option>
                            <option value="medium_term">Last 6 months</option>
                            <option value="long_term">Lifetime</option>
                        </select>
                        
                    </div>
                </div>
            </div>
        </div>
        <div class="setting">
            <div class="setting-title">
                Currently Playing
            </div>
            <div class="setting-list">
                <div class="setting-item">
                    <span class="setting-item-title">Allow Player</span>
                    <div class="setting-item-value">
                        <div class="switch" class:on={allowPlayer} class:off={!allowPlayer} on:click={setCurrentlyPlaying} on:keydown={setCurrentlyPlaying}>
                            <div class="ball">
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>

<style lang="scss">
   
    .wrapper{
            border-radius: 5px;
            display: flex;
            flex-direction: column;
            padding: 15px;
            color: var(--text-color);
            height: 100%;
            gap: 10px;
            overflow: auto;
    }

    .setting{
        border: 1px solid var(--accent-color);
        padding: 15px;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        .setting-title{
            font-size: 1rem;
            font-weight: 500;
            margin-bottom: 10px;
        }
        .setting-list{
           display: flex;
           flex-direction: column;
           gap: 10px;
           width: 100%;
            .setting-item{
                width: 100%;
                display: flex;
                gap: 10px;
                justify-content: space-between;
                align-items: center;
                .setting-item-title{
                    font-size: 0.8rem;
                    font-weight: 300;
                }
                .setting-item-value{
                    width: 25%;
                    display: flex;
                    height: 100%;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 5px;
                    font-size: 0.8rem;
                    font-weight: 400;
                }
            }
        }
    }
    .action_button{
            margin: 5px 0px;
            background-color: var(--button-color);
            color: var(--button-text-color);
            border: none;
            border-radius: 5px;
            padding: 5px;
            font-size: 0.8rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            &:hover{
                background-color: var(--button-color-hover);
                color: var(--button-text-color-hover);
            }
        }
        .switch{
        height: 100%;
        aspect-ratio: 5/3;
        background-color: var(--accent-color);
        border-radius: 10px;
        transition: all 200ms;
        display: flex;
        align-items: center;
        position: relative;
        justify-content: center;
        cursor: pointer;
        &.on{
            background-color: var(--success-color);
            .ball{
                transform: translateX(calc(50% - 2px));
            }
        }
        &.off{
            background-color: var(--danger-color);
            .ball{
                transform: translateX(calc(-50% + 2px));
            }
        }

        .ball{
            height: 100%;
            aspect-ratio: 1/1;
            background-color: var(--accent-color-hover);
            border-radius: 50px;
            transition: all 300ms;
            position: absolute;
            
        }
    }

</style>