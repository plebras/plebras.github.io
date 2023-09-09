<script>
	export let entry;
</script>

<div class="entry">
	<div class="title">
		{entry.title}
		{#if entry.subtitle}
			<span>{entry.subtitle}</span>
		{/if}
	</div>
	<div class="details">
		<div><span class="material-symbols-rounded">date_range</span>{entry.dateString}</div>
		<div><span class="material-symbols-rounded">place</span>{entry.place}</div>
	</div>
	{#if entry.description}
		<div class="text">
			<!-- eslint-disable svelte/no-at-html-tags -->
			{@html entry.description}
			<!-- eslint-enable svelte/no-at-html-tags -->
		</div>
	{/if}
</div>

<!-- <template>
    <div class="entry">
        <div class="title">{{entryData.title}} <span v-if="entryData.subtitle">{{entryData.subtitle}}</span></div>
        <div class="details">
            <div><span class="icon">date_range</span>{{entryData.dateString}}</div>
            <div><span class="icon">place</span>{{entryData.place}}</div>
        </div>
        <div class="text" v-if="entryData.description" v-html="entryData.description"></div>
    </div>
</template> -->
<!-- <script>
export default {
    name: "CVEntry",
    props: {
        entryData: Object
    }
}
</script> -->
<style>
	div.entry {
		width: 100%;
		margin: 25px 10px;

		& > div.title {
			font-weight: 700;
			word-spacing: 3px;
			margin: 5px 5px;
			font-size: 1.2rem;

			& > span {
				font-style: italic;
				font-size: 1.1rem;
			}
		}

		& > div.details {
			font-size: 1rem;
			margin: 10px 10px;
			font-style: italic;
			color: var(--clr-text-lgt);

			& > div {
				display: flex;
				flex-flow: row;
				align-items: center;
				margin: 2px 0px;

				& > span {
					font-size: 20px;
					margin-right: 10px;
					width: 20px;
					font-style: normal;
				}
			}
		}

		& > div.text {
			margin: 10px 10px;
		}
	}
</style>
