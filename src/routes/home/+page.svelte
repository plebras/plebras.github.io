<script>
	import data from '$lib/data/skills.json';
</script>

<div id="home">
	<h1>About me</h1>

	<!-- TODO: Add sunburst -->

	<div id="intro">
		<p>
			I am an Assistant Professor in Computer Science at <a
				href="https://www.hw.ac.uk/"
				target="_blank">Heriot-Watt University</a
			>, Scotland. I work at the crossroad between <b>Data Science</b>, <b>Machine Learning</b>, and
			<b>Human-Computer Interaction</b>.
		</p>
		<p>
			I specialise in <b>Information Visualisation</b> research, with a strong background in Programming
			and Software Engineering. I aim to explore the complex interactions between data, models, and the
			humnan mind. My weapons of choice are JavaScript, D3, Python, and Java.
		</p>
		<p>Outside of computers and programming, I like to solve puzzles, play games, read and cook.</p>
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
