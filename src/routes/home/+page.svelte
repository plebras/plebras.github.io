<script>
	import Sunburst from '$lib/assets/Sunburst.svelte';
	import { hierarchy as D3Hierarhy } from 'd3-hierarchy';

	import skillsData from '$lib/data/skills.json';

	import IntroText from '$lib/data/IntroText.svelte';

	function sunburstSize() {
		const s = window.innerWidth;
		return s >= 640 ? 500 : s > 540 ? 400 : 300;
	}

	const hierarchy = D3Hierarhy(skillsData)
		.sum((d) => d.value)
		.sort((a, b) => b.value - a.value);
</script>

<div id="home">
	<h1>About me</h1>

	<Sunburst {hierarchy} size={sunburstSize} />

	<div id="intro">
		<IntroText />
	</div>
</div>

<style>
	div#home {
		width: 100%;
		display: flex;
		flex-flow: column;
		justify-content: center;
		align-items: center;

		& > div#intro {
			width: 80%;
			min-width: 300px;
		}
	}
</style>
