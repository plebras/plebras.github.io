<script>
	import teaching from '$lib/data/teaching.json';

	import TeachingEntry from './TeachingEntry.svelte';
	import SectionTitle from '../SectionTitle.svelte';

	import { byYear } from '$lib/utils/date.js';
</script>

<h1>Teaching</h1>
<div id="teaching">
	{#each byYear(teaching) as year}
		<SectionTitle title={year.key} />
		{#each year.values as entry}
			<TeachingEntry {entry} />
		{/each}
	{/each}
</div>

<style>
	div#teaching {
		width: 100%;
	}
</style>
