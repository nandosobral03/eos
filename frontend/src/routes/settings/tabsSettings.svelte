<script lang="ts">
	import { tabs } from "$lib/stores/stores";
    let currentTabs:{name:string, shown:boolean}[] = [];
    let hoveringOverTab:string;

    tabs.subscribe(value => {
        currentTabs = value;
    })

    const capitalize = (tab: string) => {
        return tab.split(" ").map(w => w[0].toUpperCase() + w.slice(1)).join(" ")
    }

    const setShown = (tab: {shown:boolean})=>{
        tab.shown = !tab.shown
        tabs.set(currentTabs);
    }

    const dragStart = (event : DragEventInit,  itemIndex : number) => {
		// The data we want to make available when the element is dropped
        // is the index of the item being dragged and
        // the index of the tab from which it is leaving.
        hoveringOverTab = currentTabs[itemIndex].name;
		const data = {itemIndex};
    	event.dataTransfer?.setData('text/plain', JSON.stringify(data));
	}
	
	const  drop = (event: DragEvent, currentIndex:number) => {
        hoveringOverTab = "";
        const json = event.dataTransfer?.getData("text/plain");
        let {itemIndex} = JSON.parse(json!);
        if(currentIndex == Math.floor(currentIndex)){
            if(itemIndex > currentIndex){
                currentIndex -= 0.5;
            }else{
                currentIndex += 0.5;
            }
        }
        let aux = [{name: currentTabs[itemIndex].name, shown: currentTabs[itemIndex].shown, index: currentIndex}]
        aux = [aux, currentTabs.map((tab,i) => {
            return {name: tab.name, shown: tab.shown, index: i}
        }).filter(tab => tab.index != itemIndex)].flat()

        currentTabs = aux.sort((a,b) => a.index - b.index).map(tab => {
            return {name: tab.name, shown: tab.shown}
        })

       for(let tab , i = 0; tab = currentTabs[i]; i++){
            document.getElementById(tab.name)?.classList.remove("dragged-hover");
            document.getElementById("separator-" + i)?.classList.remove("dragged-hover");
       }
       document.getElementById("separator-" + currentTabs.length )?.classList.remove("dragged-hover");
       tabs.set(currentTabs);
	}

    


</script>


<div class="tab-list"

>
<div class="separator" 
on:dragover={event =>{
    document.getElementById("separator-0")?.classList.add("dragged-hover")
    event.preventDefault()
}}
on:dragleave={event =>{
    document.getElementById("separator-0")?.classList.remove("dragged-hover")
}}
on:drop={event => drop(event, -1)}
>
    <div id="separator-0"></div>
</div>
    {#each currentTabs as tab}
    <div class="tab"
         id = {tab.name} 
         draggable={true}
        on:dragstart={(event) => dragStart(event, currentTabs.indexOf(tab))}
        on:dragover={event =>{
            document.getElementById(tab.name)?.classList.add("dragged-hover")
            event.preventDefault()
        }}
        on:dragleave={event =>{
            document.getElementById(tab.name)?.classList.remove("dragged-hover")
        }}

        on:drop={event => drop(event, currentTabs.indexOf(tab))}
        class:dragged={hoveringOverTab == tab.name}
        > 
            {capitalize(tab.name)}
            <div class="switch" class:on={tab.shown} class:off={!tab.shown} on:click={() => setShown(tab)} on:keydown={() => setShown(tab)}>
                <div class="ball">

                </div>
            </div>
        </div>
        <div class="separator"
        on:dragover={event =>{
            document.getElementById("separator-" + (currentTabs.indexOf(tab) + 1))?.classList.add("dragged-hover")
            event.preventDefault()
        }}
        on:dragleave={event =>{
            document.getElementById("separator-" + (currentTabs.indexOf(tab) + 1))?.classList.remove("dragged-hover")
        }}
        on:drop={event =>  drop(event, currentTabs.indexOf(tab) + 0.5)}
        >
        <div  id= {"separator-" + (currentTabs.indexOf(tab) + 1)} ></div>
        </div>
    {/each}
</div>

<style lang="scss">
    .title{
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-color);
        margin-bottom: 10px;
    }

    .tab-list{
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        padding: 15px;
        padding-top: 5px;
        color: var(--text-color);
        height: 100%;
        .tab{
            border: 1px solid var(--accent-color);
            padding: 15px;
            border-radius: 5px;
            display: flex;
            justify-content: space-between;
        }
        .dragged{
            background-color: var(--accent-color-hover);
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

    .separator{
        width: 100%;
        height: 10px;
        padding: 2px;
        div{
            height: 100%;
            width: 100%;
            border-radius: 5px;
        }
      
    }

</style>