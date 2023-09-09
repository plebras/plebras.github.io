<script>
	import '$lib/styles/main.css';

	import { page } from '$app/stores';

	let basePath = '/home';
	let routes = [
		{ path: basePath, title: 'Home' },
		{ path: basePath + '/projects', title: 'Projects' },
		{ path: basePath + '/publications', title: 'Publications' },
		{ path: basePath + '/teaching', title: 'Teaching' },
		{ path: basePath + '/cv', title: 'CV' }
	];
</script>

<header>
	<h1>Pierre _ Le Bras</h1>
</header>
<div id="body">
	<nav>
		{#each routes as route}
			<a href={route.path} class:active={$page.url.pathname === route.path}>{route.title}</a>
		{/each}
	</nav>
	<main>
		<slot />
	</main>
	<footer>
		© 2023{new Date().getFullYear() > 2023 ? '-' + new Date().getFullYear() : ''} P. Le Bras. Powered
		by <a href="https://kit.svelte.dev/" target="_blank">SvelteKit</a> and
		<a href="https://d3js.org/" target="_blank">D3</a>.
	</footer>
</div>

<style>
	header {
		background-color: var(--clr-accent);
		width: 100%;
		min-width: 360px;
		min-height: 100px;
		display: flex;
		justify-content: center;
		align-items: center;

		& h1 {
			color: var(--clr-back);
			font-size: 2rem;
			font-weight: 400;
			letter-spacing: 5px;
			margin: 0;
			padding: 0;
		}
	}

	div#body {
		padding-right: 15px;
		padding-left: 15px;
		margin-top: 15px;
		margin-right: auto;
		margin-left: auto;
		min-width: 330px;
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: center;
	}

	@media (min-width: 580px) {
		div#body {
			width: 550px;
		}
	}
	@media (min-width: 780px) {
		div#body {
			width: 750px;
		}
	}
	@media (min-width: 980px) {
		div#body {
			width: 950px;
		}
	}

	@media (min-width: 1180px) {
		div#body {
			width: 1150px;
		}
	}

	nav {
		width: 100%;
		border-bottom: 2px solid #ddd;
		margin: 5px 0;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: flex-start;

		& > a {
			flex-grow: 1;
			padding: 10px 10px;
			text-align: center;
			font-size: 1.1rem;
			cursor: pointer;
			margin-bottom: -2px;
			border: 2px solid;
			border-color: hsla(0, 0%, 100%, 0);
			background-clip: padding-box;
			border-top-left-radius: 4px;
			border-top-right-radius: 4px;
			background-color: #fff;
			color: var(--clr-accent);
			&.active {
				border: 2px solid;
				border-top-left-radius: 4px;
				border-top-right-radius: 4px;
				border-color: #ddd #ddd #fff #ddd;
			}
			&:hover {
				background-color: #efefef;
			}
		}
	}

	@media (max-width: 540px) {
		nav {
			flex-direction: column;
			align-items: stretch;
		}
		nav > a {
			border: none;
			margin-bottom: 0;
			font-size: 1rem;
		}
		nav > a.active {
			border: none;
			background-color: #efefef;
		}
	}

	main {
		width: calc(100% - 52px);
		margin: 20px 0;
		padding: 0 25px;
		border-left: 2px var(--clr-accent) solid;
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: space-around;
		align-items: center;
	}

	footer {
		min-height: 50px;
		font-size: 0.8rem;
		color: var(--clr-text-lgt);
		border-top: solid 2px var(--clr-accent);
		max-width: 450px;
		width: 70%;
		padding-top: 10px;
		text-align: center;
	}
</style>
