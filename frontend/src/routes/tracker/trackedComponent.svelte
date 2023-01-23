<script lang="ts">
	import type { Tracked, TrackerForUpdate } from '$lib/models/Tracker';
	import { trackedService } from '$lib/tracker';
	export let tracked: Tracked;
	let editing = false;
	let results: TrackerForUpdate[] = [];
	let search = tracked.title.replaceAll('-', ' ');
    let searching = false;
    let oldTracked = JSON.parse(JSON.stringify(tracked));


    let loading = false;
    const searchByTitle = async (title: string) => {
        loading = true;
        const res = await trackedService.search(title);
        results = res;
        loading = false;
    };


    const setTracked = (result: TrackerForUpdate) => {
        tracked = {
            ...tracked,
            id: result.id,
            displayTitle: result.displayTitle,
            image: result.image,
            totalEpisodes: result.totalEpisodes,
        };
        searching = false;
    };


    const openEpisode = () => {
        console.log(tracked.url)
        window.open(tracked.url, '_blank');
    };


    const save = async () => {
        let promises = [];
        if(oldTracked.id !== tracked.id) {
            promises.push(trackedService.updateId(tracked.title, tracked.id));
        }
        if(oldTracked.currentEpisode != tracked.currentEpisode) {
            promises.push(trackedService.updateCurrentEpisode(tracked.title, tracked.currentEpisode));
        }
        Promise.all(promises).then(() => {
            editing = false;
            oldTracked = JSON.parse(JSON.stringify(tracked));
        });
    };

    const discard = () => {
        editing = false;
        tracked = JSON.parse(JSON.stringify(oldTracked));
    };


    const deleteTracked = async () => {
        await trackedService.deleteTracked(tracked.title);
    };
</script>

<div class="tracker" class:editing={editing}>
	<div class="image">
		<img src={tracked.image} alt={tracked.title} />
	</div>
	<div class="info">
		<div class="info" style="align-items:flex-start">
			<span class="title">{tracked.displayTitle}</span>
			{#if editing}
				<span class="description"
					>{tracked.title} - #{tracked.id}
					<span class="material-symbols-outlined edit" on:click={() => {searching = true; searchByTitle(search)}} on:keydown={() => {searching = true; searchByTitle(search)}}>search</span></span>
				{#if searching}
                    <div class="search">
                        <div class="searchbar">
                            <input type="text" placeholder="Search" bind:value={search} on:keydown={(e) => {
                                if (e.key === 'Enter') {
                                    searchByTitle(search);
                                }
                            }} />
                            <span class="material-symbols-outlined edit" on:click={() =>searchByTitle(search)} on:keydown={() =>searchByTitle(search)}>search</span>
                            <span class="material-symbols-outlined edit" on:click={() => searching = false} on:keydown={() => searching = false}>close</span>
                        
                        </div>
                        <div class="results">
                            {#each results as result}
                                <div class="result" on:click={() => setTracked(result)} on:keydown={() => setTracked(result)}>
                                    <img src={result.image} alt={result.displayTitle} />
                                    <span>{result.displayTitle} - #{result.id} </span>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}

			{:else}
				<span class="description">{tracked.title} - {tracked.status} </span>
			{/if}
		</div>
		
	</div>
	<div class="actions">
		{#if editing}
			<span
				class="material-symbols-outlined edit"
				on:click={save}
				on:keydown={save}
			>
				save
			</span>
		{:else}
			<span
				class="material-symbols-outlined edit"
				on:click={() => (editing = !editing)}
				on:keydown={() => (editing = !editing)}
			>
				edit
			</span>
		{/if}
		{#if editing}
			<span
				class="material-symbols-outlined delete"
				on:click={discard}
				on:keydown={discard}
			>
				close
			</span>
		{:else}
			<span
				class="material-symbols-outlined delete"
				on:click={deleteTracked}
				on:keydown={deleteTracked}
			>
				delete
			</span>
		{/if}
        
	</div>
    {#if editing}
                <div class="current_episode edit">
                    <input type="number" bind:value={tracked.currentEpisode} />
                    <span> / </span>
                    {tracked.totalEpisodes ? tracked.totalEpisodes : '?'}
                </div>
            {:else}
                {#if tracked.currentEpisode != tracked.totalEpisodes}
                    <div class="current_episode" on:click={openEpisode} on:keydown={openEpisode}> 
                        {tracked.currentEpisode} / {tracked.totalEpisodes ? tracked.totalEpisodes : '?'}
                    </div>
            {/if}
    {/if}
</div>

<style lang="scss">
	* {
		transition: color 0s ease-in-out, background-color 0.2s ease-in-out;
	}

	.tracker {
		width: 100%;
		background-color: var(--accent-color);
		color: var(--text-color);
		border-radius: 5px;
		padding: 10px;
		box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: row;
		justify-content:space-between;
		gap: 5px;
        position: relative;

        &.editing {
            background-color: var(--accent-color-hover);
            color: var(--text-color-hover);
        }

		&:hover {
			background-color: var(--accent-color-hover);
			color: var(--text-color-hover);
		}
		.image {
			height: 100px;
			aspect-ratio: 3/4;
			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}
		.info {
			position: relative;
			.title {
				font-size: 1rem;
				font-weight: 600;
			}
			.description {
				font-size: 0.8rem;
				font-weight: 300;

				.material-symbols-outlined {
					font-variation-settings: 'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 48;
					font-size: 12px;
					margin: auto;
					user-select: none; /* Non-prefixed version, currently
                                        supported by Chrome and Opera */
					cursor: pointer;
					&:hover {
						font-variation-settings: 'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 48;
						font-size: 12px;
						margin: auto;
						user-select: none; /* Non-prefixed version, currently
                                            supported by Chrome and Opera */
						color: var(--success-color);
					}
				}
			}

			

			flex-grow: 1;
			display: flex;
			flex-direction: column;
		}

        .current_episode {
                position: absolute;
                bottom: 16px;
                right: 16px;
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-self: flex-end;
				justify-self: flex-end;
				gap: 5px;
                height: 28px;
				font-size: 0.8rem;
				font-weight: 300;
				background-color: var(--button-color);
				color: var(--button-text-color);
				padding: 5px;
				border-radius: 5px;
				cursor: pointer;

				&.edit {
					cursor: default;
				}

				&:hover {
					background-color: var(--button-color-hover);
					color: var(--button-text-color-hover);
				}
				input {
					width: 30px;
					text-align: center;
					border: none;
					background-color: transparent;
					color: var(--text-color);
					font-size: 0.8rem;
					font-weight: 300;
					&:focus {
						outline: none;
					}
				}

			}

		.actions {
			min-width: 40px;
			.material-symbols-outlined {
				font-variation-settings: 'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 48;
				font-size: 16px;
				margin: auto;
				user-select: none; /* Non-prefixed version, currently
                                        supported by Chrome and Opera */
				cursor: pointer;
				&.delete {
					&:hover {
						color: var(--danger-color);
					}
				}
				&.edit {
					&:hover {
						color: var(--success-color);
					}
				}
			}
		}
	}

	.search {
		width: 100%;
		position: absolute;
		top: 5  0px;
        background-color: var(--accent-color);
        z-index: 999;
        color: var(--text-color);
        border-radius: 5px;
        padding: 10px;
        margin-bottom: 10px;
        gap: 10px;
        display: flex;
        flex-direction: column;
		.material-symbols-outlined {
			font-variation-settings: 'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 48;
			font-size: 16px;
			margin: auto;
			user-select: none; /* Non-prefixed version, currently
                                        supported by Chrome and Opera */
			cursor: pointer;

			&.edit {
				&:hover {
					color: var(--success-color);
				}
			}
		}
	}

    .searchbar{
        width: 100%;
        display: flex;
        input{
            flex-grow: 1;
            border: none;
            background-color: transparent;
            color: var(--text-color);
            font-size: 1rem;
            font-weight: 300;
            padding: 5px;
            border-radius: 5px;
            &:focus{
                outline: none;
                font-weight: 500; 
            }
        }
    }

    .results{
        display: flex;
        flex-direction: column;
        gap: 10px;
            
       

        .result{
            display: flex;
            gap: 5px;
            cursor: pointer;
            padding: 5px;
            border-radius: 5px;
            &:hover{
                background-color: var(--accent-color-hover);
                color: var(--text-color-hover);
            }
            img{
                aspect-ratio: 3/4;
                height: 50px;
                object-fit: cover;
            }
        }
    }

    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
    }

    /* Firefox */
    input[type=number] {
    -moz-appearance: textfield;
    }
</style>
