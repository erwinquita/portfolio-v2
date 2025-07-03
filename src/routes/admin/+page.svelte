<script lang="ts">
	import { enhance } from '$app/forms';
	import { toastStore } from '$lib/stores/toast';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let isSubmitting = $state(false);
	let showAddDialog = $state(false);
	let showEditDialog = $state(false);
	let showDeleteDialog = $state(false);
	let editingProject = $state<any>(null);
	let deletingProject = $state<any>(null);

	// Pagination state
	let currentPage = $state(1);
	let projectsPerPage = $state(6);

	// Format Date
	const formatedTimestamp = () => {
		const d = new Date();
		const date = d.toISOString().split('T')[0];
		const time = d.toTimeString().split(' ')[0];
		return `${date} ${time}`;
	};

	// Form data for add dialog
	let addFormData = $state({
		title: '',
		description: '',
		imageUrl: '',
		projectUrl: ''
	});

	// Form data for edit dialog
	let editFormData = $state({
		title: '',
		description: '',
		imageUrl: '',
		projectUrl: ''
	});

	// Original data for comparison
	let originalEditData = $state({
		title: '',
		description: '',
		imageUrl: '',
		projectUrl: ''
	});

	// Check if edit form has changes
	let hasEditChanges = $derived(
		editFormData.title !== originalEditData.title ||
			editFormData.description !== originalEditData.description ||
			editFormData.imageUrl !== originalEditData.imageUrl ||
			editFormData.projectUrl !== originalEditData.projectUrl
	);

	// Computed values for pagination
	let totalProjects = $derived(data.featuredProjects.length);
	let totalPages = $derived(Math.ceil(totalProjects / projectsPerPage));
	let startIndex = $derived((currentPage - 1) * projectsPerPage);
	let endIndex = $derived(startIndex + projectsPerPage);
	let paginatedProjects = $derived(data.featuredProjects.slice(startIndex, endIndex));

	// Pagination functions
	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
		}
	}

	function goToFirstPage() {
		currentPage = 1;
	}

	function goToLastPage() {
		currentPage = totalPages;
	}

	function nextPage() {
		if (currentPage < totalPages) {
			currentPage++;
		}
	}

	function prevPage() {
		if (currentPage > 1) {
			currentPage--;
		}
	}

	// Dialog functions
	function openAddDialog() {
		addFormData = {
			title: '',
			description: '',
			imageUrl: '',
			projectUrl: ''
		};
		showAddDialog = true;
	}

	function closeAddDialog() {
		showAddDialog = false;
	}

	function openEditDialog(project: any) {
		editingProject = project;
		const initialData = {
			title: project.title || '',
			description: project.description || '',
			imageUrl: project.imageUrl || '',
			projectUrl: project.url || project.projectUrl || ''
		};
		editFormData = { ...initialData };
		originalEditData = { ...initialData };
		showEditDialog = true;
	}

	function closeEditDialog() {
		showEditDialog = false;
		editingProject = null;
	}

	function openDeleteDialog(project: any) {
		deletingProject = project;
		showDeleteDialog = true;
	}

	function closeDeleteDialog() {
		showDeleteDialog = false;
		deletingProject = null;
	}

	// Show toast messages based on form result
	$effect(() => {
		if (form?.success) {
			if (form.action === 'create') {
				toastStore.success('Project added successfully!');
				closeAddDialog();
			} else if (form.action === 'update') {
				toastStore.success('Project updated successfully!');
				closeEditDialog();
			} else if (form.action === 'delete') {
				toastStore.success('Project deleted successfully!');
				closeDeleteDialog();
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

		<div class="text-center mb-4">
			<button type="button" class="button" onclick={openAddDialog}> Add New Project </button>
		</div>
	</div>
</section>

<section class="section" style="background: var(--portfolio-surface);">
	<div class="container">
		<h2>Existing Projects ({totalProjects})</h2>

		{#if totalProjects > 0}
			<div class="grid">
				{#each paginatedProjects as project}
					<div class="card">
						<h3>{project.title}</h3>
						<p>{project.description}</p>
						{#if project.imageUrl}
							<img
								src={project.imageUrl}
								alt={project.title}
								style="width: 100%; height: 100px; object-fit: cover;"
							/>
						{/if}
						<p>
							URL: <a
								href={project.url || project.projectUrl}
								target="_blank"
								rel="noopener noreferrer">{project.url || project.projectUrl}</a
							>
						</p>
						<p>
							Created: {new Date(project.createdAt || '').toLocaleDateString()}
						</p>
						<div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
							<button
								type="button"
								class="button"
								onclick={() => openEditDialog(project)}
							>
								Edit
							</button>
							<button
								type="button"
								class="button"
								style="background: var(--red-5);"
								onclick={() => openDeleteDialog(project)}
							>
								Delete
							</button>
						</div>
					</div>
				{/each}
			</div>

			<!-- Pagination Controls -->
			{#if totalPages > 1}
				<div
					class="pagination-container"
					style="display: flex; justify-content: center; align-items: center; gap: 0.5rem; margin-top: 2rem; flex-wrap: wrap;"
				>
					<button
						type="button"
						class="button pagination-btn"
						onclick={goToFirstPage}
						disabled={currentPage === 1}
						style="padding: 0.5rem 0.75rem;"
					>
						First
					</button>

					<button
						type="button"
						class="button pagination-btn"
						onclick={prevPage}
						disabled={currentPage === 1}
						style="padding: 0.5rem 0.75rem;"
					>
						←
					</button>

					{#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
						{#if page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2)}
							<button
								type="button"
								class="button pagination-btn"
								onclick={() => goToPage(page)}
								style="padding: 0.5rem 0.75rem; {page === currentPage
									? 'background: var(--blue-5); color: white;'
									: ''}"
							>
								{page}
							</button>
						{:else if page === currentPage - 3 || page === currentPage + 3}
							<span style="padding: 0.5rem;">...</span>
						{/if}
					{/each}

					<button
						type="button"
						class="button pagination-btn"
						onclick={nextPage}
						disabled={currentPage === totalPages}
						style="padding: 0.5rem 0.75rem;"
					>
						→
					</button>

					<button
						type="button"
						class="button pagination-btn"
						onclick={goToLastPage}
						disabled={currentPage === totalPages}
						style="padding: 0.5rem 0.75rem;"
					>
						Last
					</button>
				</div>

				<div class="text-center" style="margin-top: 1rem; color: var(--gray-6);">
					Page {currentPage} of {totalPages} | Showing {startIndex + 1}-{Math.min(
						endIndex,
						totalProjects
					)} of {totalProjects} projects
				</div>
			{/if}
		{:else}
			<div class="text-center">
				<p>No projects yet. Add your first project!</p>
			</div>
		{/if}
	</div>
</section>

<!-- Add Project Dialog -->
{#if showAddDialog}
	<dialog
		open
		class="dialog-backdrop"
		onclick={(e) => e.target === e.currentTarget && closeAddDialog()}
	>
		<div
			class="dialog-content"
			style="background: var(--portfolio-surface); "
		>
			<button
				type="button"
				class="dialog-close"
				onclick={closeAddDialog}
				style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer;"
				>×</button
			>

			<h2 style="margin-top: 0;">Add New Project</h2>

			{#if form?.error && form?.action === 'create'}
				<div
					class="card"
					style="background: var(--red-1); border-color: var(--red-4); margin-bottom: var(--size-4);"
				>
					<p style="color: var(--red-8); margin: 0;">
						{form.error}
					</p>
				</div>
			{/if}

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
					<label for="add-title" class="form-label">Project Title</label>
					<input
						type="text"
						id="add-title"
						name="title"
						class="form-input"
						required
						bind:value={addFormData.title}
					/>
				</div>

				<div class="form-group">
					<label for="add-description" class="form-label">Description</label>
					<textarea
						id="add-description"
						name="description"
						class="form-textarea"
						required
						rows="4"
						bind:value={addFormData.description}
					></textarea>
				</div>

				<div class="form-group">
					<label for="add-imageUrl" class="form-label">Image URL</label>
					<input
						type="text"
						id="add-imageUrl"
						name="imageUrl"
						class="form-input"
						required
						placeholder="https://example.com/image.jpg"
						bind:value={addFormData.imageUrl}
					/>
				</div>

				<div class="form-group">
					<label for="add-projectUrl" class="form-label">Project URL</label>
					<input
						type="url"
						id="add-projectUrl"
						name="projectUrl"
						class="form-input"
						required
						placeholder="https://example.com"
						bind:value={addFormData.projectUrl}
					/>
				</div>

				<div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem;">
					<button
						type="button"
						class="button"
						onclick={closeAddDialog}
						style="background: var(--gray-4);"
					>
						Cancel
					</button>
					<button type="submit" class="button" disabled={isSubmitting}>
						{isSubmitting ? 'Adding...' : 'Add Project'}
					</button>
				</div>
			</form>
		</div>
	</dialog>
{/if}

<!-- Edit Project Dialog -->
{#if showEditDialog && editingProject}
	<dialog
		open
		class="dialog-backdrop"
		onclick={(e) => e.target === e.currentTarget && closeEditDialog()}
	>
		<div
			class="dialog-content"
			style="background: var(--portfolio-surface); border-radius: 8px; padding: 2rem; position: relative;"
		>
			<button
				type="button"
				class="dialog-close"
				onclick={closeEditDialog}
				style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer;"
				>×</button
			>

			<h2 style="margin-top: 0;">Edit Project</h2>

			{#if form?.error && form?.action === 'update'}
				<div
					class="card"
					style="background: var(--red-1); border-color: var(--red-4); margin-bottom: var(--size-4);"
				>
					<p style="color: var(--red-8); margin: 0;">
						{form.error}
					</p>
				</div>
			{/if}

			<form
				method="POST"
				action="?/update"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						isSubmitting = false;
						await update();
					};
				}}
			>
				<input type="hidden" name="id" value={editingProject.id} />
				<input type="hidden" name="updatedAt" value={formatedTimestamp()} />

				<div class="form-group">
					<label for="edit-title" class="form-label">Project Title</label>
					<input
						type="text"
						id="edit-title"
						name="title"
						class="form-input"
						required
						bind:value={editFormData.title}
					/>
				</div>

				<div class="form-group">
					<label for="edit-description" class="form-label">Description</label>
					<textarea
						id="edit-description"
						name="description"
						class="form-textarea"
						required
						rows="4"
						bind:value={editFormData.description}
					></textarea>
				</div>

				<div class="form-group">
					<label for="edit-imageUrl" class="form-label">Image URL</label>
					<input
						type="text"
						id="edit-imageUrl"
						name="imageUrl"
						class="form-input"
						required
						placeholder="https://example.com/image.jpg"
						bind:value={editFormData.imageUrl}
					/>
				</div>

				<div class="form-group">
					<label for="edit-projectUrl" class="form-label">Project URL</label>
					<input
						type="url"
						id="edit-projectUrl"
						name="projectUrl"
						class="form-input"
						required
						placeholder="https://example.com"
						bind:value={editFormData.projectUrl}
					/>
				</div>

				<div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem;">
					<button
						type="button"
						class="button"
						onclick={closeEditDialog}
						style="background: var(--gray-4);"
					>
						Cancel
					</button>
					<button type="submit" class="button" class:button-disabled={!hasEditChanges} disabled={isSubmitting || !hasEditChanges}>
						{isSubmitting ? 'Updating...' : 'Update Project'}
					</button>
				</div>
			</form>
		</div>
	</dialog>
{/if}

<!-- Delete Confirmation Dialog -->
{#if showDeleteDialog && deletingProject}
	<dialog
		open
		class="dialog-backdrop"
		onclick={(e) => e.target === e.currentTarget && closeDeleteDialog()}
	>
		<div
			class="dialog-content delete-dialog"
			style="max-width: 400px; margin: 2rem auto; background: white; border-radius: 8px; padding: 2rem; position: relative; text-align: center;"
		>
			<button
				type="button"
				class="dialog-close"
				onclick={closeDeleteDialog}
				style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer;"
				>×</button
			>

			<div style="margin-bottom: 1.5rem;">
				<div
					style="width: 64px; height: 64px; margin: 0 auto 1rem; background: var(--red-1); border-radius: 50%; display: flex; align-items: center; justify-content: center;"
				>
					<svg
						width="32"
						height="32"
						viewBox="0 0 24 24"
						fill="none"
						stroke="var(--red-6)"
						stroke-width="2"
					>
						<path
							d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6"
						/>
					</svg>
				</div>
				<h3 style="margin: 0 0 0.5rem 0; color: var(--red-7);">Delete Project</h3>
				<p style="margin: 0; color: var(--gray-6);">
					Are you sure you want to delete <strong>"{deletingProject.title}"</strong>?
				</p>
				<p style="margin: 0.5rem 0 0 0; color: var(--gray-5); font-size: 0.875rem;">
					This action cannot be undone.
				</p>
			</div>

			<form
				method="POST"
				action="?/delete"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						isSubmitting = false;
						await update();
					};
				}}
			>
				<input type="hidden" name="id" value={deletingProject.id} />

				<div style="display: flex; gap: 1rem; justify-content: center;">
					<button
						type="button"
						class="button"
						onclick={closeDeleteDialog}
						style="background: var(--gray-4); min-width: 100px;"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="button"
						disabled={isSubmitting}
						style="background: var(--red-5); color: white; min-width: 100px;"
					>
						{isSubmitting ? 'Deleting...' : 'Delete'}
					</button>
				</div>
			</form>
		</div>
	</dialog>
{/if}

<style>
	.delete-dialog {
		max-height: none;
		overflow: visible;
	}

	.pagination-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}


	@media (max-width: 768px) {
		.dialog-content {
			margin: 1rem;
			padding: 1rem;
		}

		.pagination-container {
			gap: 0.25rem;
		}

		.pagination-btn {
			padding: 0.25rem 0.5rem !important;
			font-size: 0.875rem;
		}
	}
</style>
