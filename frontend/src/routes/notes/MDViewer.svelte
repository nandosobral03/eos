<script lang="ts">
	import { currentNote } from "$lib/stores/stores";
	import DOMPurify from "dompurify";
    import {marked} from "marked"
    let note = ""
    currentNote.subscribe((n) => {
        note = DOMPurify.sanitize(marked.parse(n.content));
    })
</script>

<div class="wrapper">
    {@html note}
</div>

<style>
    .wrapper{
        width: 100%;
        height: 100%;
        color: var(--text-color);
        background-color: var(--background-color);
        padding: 10px 30px;
        overflow: auto;
    }
</style>