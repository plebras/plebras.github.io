<script>
	export let entry;

	import { page } from '$app/stores';
	const docPath = $page.url.origin + '/docs/';
</script>

<div class="teaching">
	<p class="title">{entry.title}</p>
	{#if entry.notes}
		{#each entry.notes as note}
			<p class="notes">{note}</p>
		{/each}
	{/if}
	{#if entry.docs}
		{#each entry.docs as doc}
			<a href={docPath + doc[1]} target="_blank">{doc[0]}<br /></a>
		{/each}
	{/if}
	{#if entry.links}
		{#each entry.links as link}
			<a href={link[1]} target="_blank">{link[0]}<br /></a>
		{/each}
	{/if}
</div>

<!-- <template>
    <div class="teaching">
        <p class="title">{{teachingData.title}}</p>
        <p v-for="(p,i) in teachingData.notes" :key="`p-${i}`" class="notes">{{p}}</p>
        <a v-for="(a,i) in teachingData.docs" :key="`d-${i}`" :href="`${publicPath}docs/${a[1]}`" target="_blank">{{a[0]}}<br/></a>
        <a v-for="(a,i) in teachingData.links" :key="`a-${i}`" :href="a[1]" target="_blank">{{a[0]}}<br/></a>
    </div>
</template> -->
<!-- <script>
export default {
  name: "TeachingEntry",
  data: ()=>{
    return {publicPath: process.env.BASE_URL}
  },
  props: {
    teachingData: Object
  }
};
</script> -->
<style>
	div.teaching {
		margin-top: 10px;
		margin-bottom: 25px;
		margin-left: 20px;
		width: 100%;

		& > p {
			margin-top: 8px;
			margin-bottom: 8px;

			&.title {
				font-weight: 700;
				word-spacing: 3px;
				margin-bottom: 5px;
				margin-top: 0px;
				font-size: 1.1em;
			}
		}
	}
</style>
