<script>
	import projects from '$lib/data/projects.json';

	import Project from './Project.svelte';

	import { byYear } from '$lib/utils/date.js';
</script>

<h1>Projects</h1>
<div id="projects">
	{#each byYear(projects).flatMap((d) => d.values) as project}
		<Project {project} />
	{/each}
</div>

<style>
	div#projects {
		width: 100%;
	}
</style>
