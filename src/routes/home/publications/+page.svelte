<script>
	import publications from '$lib/data/publications.json';

	import Publication from './Publication.svelte';
	import SectionTitle from '../SectionTitle.svelte';

	import { byYear } from '$lib/utils/date.js';
</script>

<h1>List of Publications</h1>
<div id="publications">
	{#each byYear(publications) as year}
		<SectionTitle title={year.key} />
		{#each year.values as publication}
			<Publication {publication} />
		{/each}
	{/each}
</div>

<style>
	div#publications {
		width: 100%;
	}
</style>
