<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import ToastContainer from '$lib/components/ToastContainer.svelte';

	let { children } = $props();

	const navItems = [
		// { href: '/', label: 'Home' },
		{ href: '/about', label: 'About' },
		{ href: '/portfolio', label: 'Portfolio' },
		{ href: '/contact', label: 'Contact' }
	];
</script>

<nav class="nav">
	<div class="container">
		<ul class="nav-list">
			<li>
				<a href="/" class="nav-link" style="font-weight: var(--font-weight-7);">Home</a>
			</li>
			{#each navItems as item}
				<li>
					<a href={item.href} class="nav-link" class:active={$page.url.pathname === item.href}>
						{item.label}
					</a>
				</li>
			{/each}
		</ul>
	</div>
</nav>

<main>
	{@render children()}
</main>

<footer class="section" style="background: var(--portfolio-surface); margin-top: var(--size-8);">
	<div class="container text-center">
		<p>&copy; 2025 Portfolio App. Built with SvelteKit & Open Props.</p>
	</div>
</footer>

<!-- Toast Container -->
<ToastContainer />
