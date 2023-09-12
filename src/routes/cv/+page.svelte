<script>
	import cv from '$lib/data/cv.json';

	import CvRubric from './CVRubric.svelte';

	function sortedRubrics() {
		return cv
			.map((r) => r)
			.sort((a, b) => {
				return a.order - b.order;
			});
	}
</script>

<h1>Curriculum</h1>
<div id="cv">
	{#each sortedRubrics() as rubric}
		<CvRubric {rubric} />
	{/each}
</div>

<style>
	div#cv {
		width: 100%;
	}
</style>
