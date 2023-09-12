<script>
	export let project;

	import SectionTitle from '../SectionTitle.svelte';

	import { page } from '$app/stores';
	const imgPath = $page.url.origin + '/img/projects/';
</script>

<div class="project">
	<div class="details">
		<SectionTitle title={project.title} />
		{#if project.notes}
			{#each project.notes as note}
				<p class="note">{note}</p>
			{/each}
		{/if}
		{#if project.links}
			{#each project.links as link}
				<a href={link[1]} target="_blank">{link[0]}<br /></a>
			{/each}
		{/if}
	</div>
	<img src={imgPath + project.image} alt={project.image} />
</div>

<style>
	div.project {
		margin-top: 10px;
		margin-bottom: 25px;
		margin-left: 20px;
		display: flex;
		flex-flow: row;
		flex-wrap: nowrap;
		align-items: flex-start;
		width: 100%;

		& > img {
			width: 30%;
			border-radius: 50%;

			&:after {
				content: '';
				display: block;
				padding-bottom: 100%;
			}
		}

		& > div.details {
			width: 70%;
			margin-right: 30px;

			& > p {
				margin-top: 8px;
				margin-bottom: 8px;
			}
		}
	}
</style>
