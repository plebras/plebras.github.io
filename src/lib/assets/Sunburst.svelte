<!-- D3 Sunburst adapted from M. Bostock https://observablehq.com/@d3/zoomable-sunburst -->

<script>
    import { onMount } from 'svelte';
    import { partition as D3Partition } from 'd3-hierarchy';
    import { arc as D3Arc } from 'd3-shape';
    import { select as D3Select } from 'd3-selection';

    export let hierarchy;
    export let size;

    let sunburst;

    function initSunburst(){
        const svg = D3Select(sunburst).append('svg');
		svg.append('path').classed('back', true).datum(root);
		svg.selectAll('path.arc')
			.data(root.descendants().slice(1))
			.join('path')
			.classed('arc', true)
			.append('title')
			.text((d) =>
				d.ancestors()
					.map((d) => d.data.name)
					.reverse()
					.slice(1)
					.join('/')
			);
		svg
			.selectAll('text')
			.data(root.descendants().slice(1))
			.join('text')
			.attr('dy', '0.35em')
			.text((d) => d.data.name);
		return svg;
    }

    function drawSunburst(svg, width) {
		const height = width;
		const radius = width / 8 - 1;
		const arc = D3Arc()
			.startAngle((d) => d.x0)
			.endAngle((d) => d.x1)
			.padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.02))
			.padRadius(radius * 1.5)
			.innerRadius((d) => d.y0 * radius)
			.outerRadius((d) => Math.max(d.y0 * radius, d.y1 * radius));
		const labelTransform = (d) => {
			const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
			const y = ((d.y0 + d.y1) / 2) * radius;
			return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180}) scale(${
				width / 600
			})`;
		};
		svg
			.attr('width', width)
			.attr('height', height)
			.attr('viewBox', [-width / 2, -height / 2, width, width]);
		svg.selectAll('path').attr('d', arc);
		svg.selectAll('path.arc').attr('d', arc);
		svg.selectAll('text').attr('transform', labelTransform);
	}

    const root = D3Partition().size([2 * Math.PI, hierarchy.height + 1])(hierarchy);
	root.y0 = 1 + 0.05;
	root.y1 = root.height + 1 - 0.05;

    onMount(()=>{
        const svg = initSunburst();
        const updateSunburst = () =>{
            const w = typeof size === 'function' ? size() : size;
            drawSunburst(svg, w);
        }
        updateSunburst();
        window.addEventListener('resize', updateSunburst);
    });
</script>

<div class='sunburst' bind:this="{sunburst}"></div>

<style>
    div.sunburst{
        & > svg {
            font: 0.7rem var(--font-body);
            & > path.back {
                fill: var(--clr-accent);
            }
            & > path.arc {
                fill: var(--clr-back);
                stroke: var(--clr-back);
                stroke-width: 1px;
            }
            & > text {
                text-anchor: middle;
                user-select: none;
            }
        }
    }
</style>