<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Portfolio - My Work</title>
	<meta name="description" content="Explore my portfolio of web development projects" />
</svelte:head>

<section class="section">
	<div class="container">
		<h1 class="text-center mb-4">My Portfolio</h1>
		<p class="text-center" style="color: var(--gray-6); margin-bottom: var(--size-6);">
			Here are some of the projects I've worked on. Each project represents a unique challenge 
			and learning experience.
		</p>
		
		{#if data.projects.length > 0}
			<div class="grid">
				{#each data.projects as project}
					<article class="portfolio-item">
						<div class="portfolio-content">
							<h3>{project.title}</h3>
							<p>{project.description}</p>
							<img src={project.imageUrl} alt={project.title} />
							<div style="display: flex; justify-content: space-between; align-items: center;">
								<a href={project.projectUrl} target="_blank" rel="noopener noreferrer" class="button">
									View Project
								</a>
								<small style="color: var(--gray-5);">
									{new Date(project.createdAt || '').toLocaleDateString()}
								</small>
							</div>
						</div>
					</article>
				{/each}
			</div>
		{:else}
			<div class="text-center">
				<div class="card" style="max-width: 500px; margin: 0 auto;">
					<h3>No Projects Yet</h3>
					<p>I'm currently working on some exciting projects. Check back soon to see my latest work!</p>
					<a href="/contact" class="button">Get In Touch</a>
				</div>
			</div>
		{/if}
	</div>
</section>

{#if data.projects.length > 0}
	<section class="section" style="background: var(--portfolio-surface);">
		<div class="container">
			<h2>Technologies Used</h2>
			<div class="prose text-center">
				<p>
					These projects showcase my experience with various technologies including 
					SvelteKit, Drizzle ORM, TypeScript, modern CSS, and database management.
				</p>
			</div>
		</div>
	</section>
{/if}
