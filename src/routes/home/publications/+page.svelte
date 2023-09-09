<script>
	import publications from '$lib/data/publications.json';

	import Publication from './Publication.svelte';
	import SectionTitle from '../SectionTitle.svelte';

	import dateUtils from '$lib/utils/date.js';

	function publicationsByYear() {
		let count = 0;
		return Object.entries(
			publications.reduce((res, cur) => {
				let y = dateUtils.getY(cur.date);
				res[y] = res[y] || [];
				cur.id = count++;
				res[y].push(cur);
				return res;
			}, Object.create(null))
		)
			.map((e) => {
				return {
					key: e[0].toString(),
					values: e[1].sort((a, b) => {
						return dateUtils.comp(a.date, b.date);
					})
				};
			})
			.sort((a, b) => {
				return b.key - a.key;
			});
	}
</script>

<h1>List of Publications</h1>
<div id="publications">
	{#each publicationsByYear() as year}
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
