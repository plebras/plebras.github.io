<script>
	export let publication;

	const authorStrings = ['Pierre Le Bras', 'P. Le Bras'];
	function emphasiseAuthor(str) {
		for (let auth of authorStrings) {
			str = str.replace(auth, `<b>${auth}</b>`);
		}
		return str;
	}
</script>

<div class="publication">
	<div class="link">
		{#if publication.url}
			<a class="material-symbols-rounded" href={publication.url} target="_blank">open_in_new</a>
		{/if}
	</div>
	<div class="details">
		<p class="title">{publication.title}</p>
		<!-- eslint-disable svelte/no-at-html-tags -->
		<p class="authors">{@html emphasiseAuthor(publication.authors)}</p>
		<!-- eslint-enable svelte/no-at-html-tags -->
		<p class="notes">{publication.notes}</p>
	</div>
</div>

<style>
	div.publication {
		margin-top: 10px;
		margin-bottom: 25px;
		margin-left: 20px;
		display: flex;
		flex-flow: row;
		flex-wrap: nowrap;
		align-items: center;
		width: 100%;

		& > div.link {
			width: 8%;
			display: flex;
			justify-content: center;

			& > a {
				align-self: center;
				text-align: center;
				font-size: 30px;
			}
		}

		& > div.details {
			width: 92%;
			margin-top: 8px;
			padding-left: 10px;

			& > p.title {
				font-weight: 600;
				word-spacing: 3px;
				margin-bottom: 5px;
				margin-top: 0px;
				font-size: 1.2rem;
			}

			& > p.authors {
				margin-top: 5px;
				margin-bottom: 5px;
				font-size: 1rem;
			}

			& > p.notes {
				font-style: italic;
				margin-top: 5px;
				margin-bottom: 0px;
				color: var(--clr-text-lgt);
				font-size: 0.9rem;
			}
		}
	}
</style>
