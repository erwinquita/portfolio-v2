<script lang="ts">
	import { enhance } from '$app/forms';
	import { toastStore } from '$lib/stores/toast';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let isSubmitting = $state(false);

	// Show toast messages based on form result
	$effect(() => {
		if (form?.success) {
			if (form.action === 'create') {
				toastStore.success('Project added successfully!');
			} else if (form.action === 'delete') {
				toastStore.success('Project deleted successfully!');
			}
		} else if (form?.error) {
			toastStore.error(form.error);
		}
	});
</script>

<svelte:head>
	<title>Admin - Portfolio Management</title>
	<meta name="description" content="Manage portfolio projects" />
</svelte:head>

<section class="section">
	<div class="container">
		<h1 class="text-center mb-4">Portfolio Admin</h1>

		<div style="max-width: 600px; margin: 0 auto;">
			<h2>Add New Project</h2>

			<form
				method="POST"
				action="?/create"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						isSubmitting = false;
						await update();
					};
				}}
			>
				<div class="form-group">
					<label for="title" class="form-label">Project Title</label>
					<input
						type="text"
						id="title"
						name="title"
						class="form-input"
						required
						value={form?.data?.title || ''}
					/>
				</div>

				<div class="form-group">
					<label for="description" class="form-label">Description</label>
					<textarea id="description" name="description" class="form-textarea" required rows="4"
						>{form?.data?.description || ''}</textarea
					>
				</div>

				<div class="form-group">
					<label for="imageUrl" class="form-label">Image URL</label>
					<input
						type="text"
						id="imageUrl"
						name="imageUrl"
						class="form-input"
						required
						placeholder="https://example.com/image.jpg"
						value={form?.data?.imageUrl || ''}
					/>
				</div>

				<div class="form-group">
					<label for="projectUrl" class="form-label">Project URL</label>
					<input
						type="url"
						id="projectUrl"
						name="projectUrl"
						class="form-input"
						required
						placeholder="https://example.com"
						value={form?.data?.projectUrl || ''}
					/>
				</div>

				<div class="text-center">
					<button type="submit" class="button" disabled={isSubmitting}>
						{isSubmitting ? 'Adding...' : 'Add Project'}
					</button>
				</div>
			</form>
		</div>
	</div>
</section>

<section class="section" style="background: var(--portfolio-surface);">
	<div class="container">
		<h2>Existing Projects</h2>

		{#if data.featuredProjects.length > 0}
			<div class="grid">
				{#each data.featuredProjects as project}
					<div class="card">
						<h3>{project.title}</h3>
						<p>{project.description}</p>
						<p style="color: var(--gray-5); font-size: var(--font-size-1);">
							URL: <a href={project.projectUrl} target="_blank" rel="noopener noreferrer"
								>{project.projectUrl}</a
							>
						</p>
						<p style="color: var(--gray-5); font-size: var(--font-size-1);">
							Created: {new Date(project.createdAt || '').toLocaleDateString()}
						</p>
						<form
							method="POST"
							action="?/delete"
							use:enhance={() => {
								return async ({ update }) => {
									if (confirm('Are you sure you want to delete this project?')) {
										// toastStore.info('Deleting project...');
										await update();
									}
								};
							}}
						>
							<input type="hidden" name="id" value={project.id} />
							<button type="submit" class="button" style="background: var(--red-5);">
								Delete
							</button>
						</form>
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-center">
				<p>No projects yet. Add your first project above!</p>
			</div>
		{/if}
	</div>
</section>

