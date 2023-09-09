<script>
	import CvEntry from './CVEntry.svelte';
	import SectionTitle from '../SectionTitle.svelte';

	import { comp } from '$lib/utils/date.js';

	export let rubric;

	function sortedEntries() {
		let count = 0;
		return rubric.entries
			.map((e) => {
				e.id = count++;
				return e;
			})
			.sort((a, b) => {
				return comp(a.date, b.date);
			});
	}
</script>

<div class="rubric">
	<SectionTitle title={rubric.rubric} />
	{#each sortedEntries() as entry}
		<CvEntry {entry} />
	{/each}
</div>

<style>
	div.rubric {
		width: 100%;
	}
</style>
