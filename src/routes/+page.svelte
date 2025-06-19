<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Home - Portfolio</title>
	<meta name="description" content="Welcome to my portfolio website" />
</svelte:head>

<section class="hero">
	<div class="container">
		<h1>Welcome to My Portfolio</h1>
		<p>
			I'm a passionate developer creating amazing digital experiences. Explore my work and get to
			know more about my journey in the world of technology.
		</p>
		<div style="margin-top: var(--size-5);">
			<a href="/portfolio" class="button">View My Work</a>
			<a href="/contact" class="button secondary" style="margin-left: var(--size-3);">Get In Touch</a>
		</div>
	</div>
</section>

<section class="section">
	<div class="container">
		<h2>Featured Projects</h2>
		{#if data.featuredProjects.length > 0}
			<div class="grid">
				{#each data.featuredProjects as project}
					<article class="portfolio-item">
						<div class="portfolio-content">
							<h3>{project.title}</h3>
							<p>{project.description}</p>
							<a href={project.projectUrl} target="_blank" rel="noopener noreferrer" class="button">
								View Project
							</a>
						</div>
					</article>
				{/each}
			</div>
		{:else}
			<div class="text-center">
				<p>No featured projects yet. Check back soon!</p>
			</div>
		{/if}
	</div>
</section>

<section class="section" style="background: var(--portfolio-surface);">
	<div class="container">
		<h2>What I Do</h2>
		<div class="grid">
			<div class="card">
				<h3>Web Development</h3>
				<p>Creating responsive and performant web applications using modern technologies.</p>
			</div>
			<div class="card">
				<h3>UI/UX Design</h3>
				<p>Designing user-friendly interfaces that provide excellent user experiences.</p>
			</div>
			<div class="card">
				<h3>Full Stack Development</h3>
				<p>Building complete applications from frontend to backend with modern frameworks.</p>
			</div>
		</div>
	</div>
</section>
