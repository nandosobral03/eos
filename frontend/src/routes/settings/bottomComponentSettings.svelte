<script lang="ts">
	import { bottomComponent, refreshBottom } from "$lib/stores/stores";
	import axios from "axios";

    let bottomImage: FileList;

    let bottomContainerType : string;
    bottomComponent.subscribe((n) => {
        if(bottomContainerType != n) bottomContainerType = n;
    })

    const setBottomImage = async () => {
        if(bottomImage.length == 1){
            const formData = new FormData();
            formData.append('image', bottomImage[0]);
            const data = await axios.post('/settings/image',formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });
            if(data.status == 200){
                refreshBottom.update(n => !n);
            }
            
        }
    }

</script>

<div class="wrapper">
    <div class="wrapper">
        <div class="setting">
            <div class="setting-title">
                Bottom Container
            </div>
            <div class="setting-list">
                <div class="setting-item">
                    <span class="setting-item-title">Type</span>
                    <div class="setting-item-value">
                        <select class="action_button" bind:value={bottomContainerType} on:change={() => {bottomComponent.set(bottomContainerType)}}>
                            <option value="potd">NASA POTD</option>
                            <option value="single-image">Image</option>
                            <option value="none">None</option>
                        </select>
                    </div>
                </div>
                    {#if bottomContainerType == "single-image"}
                        
                    <div class="setting-item">
                        <div class="setting-list">
                            <div class="setting-item">
                                <span class="setting-item-title">Image</span>
                                <div class="setting-item-value">
                                    <button class="action_button" on:click={() => {document.getElementById('bottom_image')?.click()}}>Upload</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
    <input type="file" accept="image/*" id="bottom_image" bind:files={bottomImage} on:change={setBottomImage} style="display: none;" />

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
                    display: flex;
                    align-items: center;
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

</style>