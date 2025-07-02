<script lang="ts">
	import { enhance } from '$app/forms';
	import { toastStore } from '$lib/stores/toast';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let isSubmitting = $state(false);
	let dialog: HTMLDialogElement;
	let editDialog: HTMLDialogElement;
	let editingProject = $state<any>({
		id: '',
		title: '',
		description: '',
		imageUrl: '',
		projectUrl: ''
	});
	let originalProject = $state<any>({
		id: '',
		title: '',
		description: '',
		imageUrl: '',
		projectUrl: ''
	});
	let isEditing = $state(false);

	const formatedTimestamp = () => {
		const d = new Date();
		const date = d.toISOString().split('T')[0];
		const time = d.toTimeString().split(' ')[0];
		return `${date} ${time}`;
	};

	// Show toast messages based on form result
	$effect(() => {
		if (form?.success) {
			if (form.action === 'create') {
				toastStore.success('Project added successfully!');
				// Close dialog on successful creation
				if (dialog) {
					dialog.close();
				}
			} else if (form.action === 'update') {
				toastStore.success('Project updated successfully!');
				// Close edit dialog on successful update
				if (editDialog) {
					editDialog.close();
				}
				editingProject = {
					id: '',
					title: '',
					description: '',
					imageUrl: '',
					projectUrl: ''
				};
				originalProject = {
					id: '',
					title: '',
					description: '',
					imageUrl: '',
					projectUrl: ''
				};
				isEditing = false;
			} else if (form.action === 'delete') {
				toastStore.success('Project deleted successfully!');
			}
		} else if (form?.error) {
			toastStore.error(form.error);
		}
	});

	function openDialog() {
		if (dialog) {
			dialog.showModal();
		}
	}

	function closeDialog() {
		if (dialog) {
			dialog.close();
		}
	}

	function openEditDialog(project: any) {
		const projectData = {
			id: project.id,
			title: project.title || '',
			description: project.description || '',
			imageUrl: project.imageUrl || '',
			projectUrl: project.projectUrl || ''
		};

		editingProject = { ...projectData };
		originalProject = { ...projectData };
		isEditing = true;

		if (editDialog) {
			editDialog.showModal();
		}
	}

	function closeEditDialog() {
		if (editDialog) {
			editDialog.close();
		}
		editingProject = {
			id: '',
			title: '',
			description: '',
			imageUrl: '',
			projectUrl: ''
		};
		originalProject = {
			id: '',
			title: '',
			description: '',
			imageUrl: '',
			projectUrl: ''
		};
		isEditing = false;
	}

	// Check if any field has changed
	function hasChanges(): boolean {
		return (
			editingProject.title !== originalProject.title ||
			editingProject.description !== originalProject.description ||
			editingProject.imageUrl !== originalProject.imageUrl ||
			editingProject.projectUrl !== originalProject.projectUrl
		);
	}

	// Get changed fields for better user feedback
	function getChangedFields(): string[] {
		const changes: string[] = [];
		if (editingProject.title !== originalProject.title) changes.push('Title');
		if (editingProject.description !== originalProject.description) changes.push('Description');
		if (editingProject.imageUrl !== originalProject.imageUrl) changes.push('Image URL');
		if (editingProject.projectUrl !== originalProject.projectUrl) changes.push('Project URL');
		return changes;
	}
</script>

<svelte:head>
	<title>Admin - Portfolio Management</title>
	<meta name="description" content="Manage portfolio projects" />
</svelte:head>

<section class="section">
	<div class="container">
		<h1 class="text-center mb-4">Portfolio Admin</h1>

		<div class="text-center mb-4">
			<button type="button" class="button" onclick={openDialog}> Add New Project </button>
		</div>

		<!-- Dialog for adding new project -->
		<dialog bind:this={dialog} class="project-dialog">
			<div class="dialog-content">
				<div class="dialog-header">
					<h2>Add New Project</h2>
					<button type="button" class="close-button" onclick={closeDialog}> &times; </button>
				</div>

				{#if form?.error && !isEditing}
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

					<div class="dialog-actions">
						<button type="button" class="button button-secondary" onclick={closeDialog}>
							Cancel
						</button>
						<button type="submit" class="button" disabled={isSubmitting}>
							{isSubmitting ? 'Adding...' : 'Add Project'}
						</button>
					</div>
				</form>
			</div>
		</dialog>

		<!-- Dialog for editing existing project -->
		<dialog bind:this={editDialog} class="project-dialog">
			<div class="dialog-content">
				<div class="dialog-header">
					<h2>Edit Project</h2>
					<button type="button" class="close-button" onclick={closeEditDialog}> &times; </button>
				</div>

				{#if form?.error && isEditing}
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
						// Check if there are any changes before submitting
						if (!hasChanges()) {
							toastStore.info('No changes detected. Nothing to update.');
							return ({ cancel }) => cancel();
						}

						isSubmitting = true;
						const changedFields = getChangedFields();
						// toastStore.info(`Updating: ${changedFields.join(', ')}`);

						return async ({ update }) => {
							isSubmitting = false;
							await update();
						};
					}}
				>
					<input type="hidden" name="id" value={editingProject.id} />

					<div class="form-group">
						<label for="edit-title" class="form-label">Project Title</label>
						<input
							type="text"
							id="edit-title"
							name="title"
							class="form-input"
							required
							bind:value={editingProject.title}
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
							bind:value={editingProject.description}
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
							bind:value={editingProject.imageUrl}
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
							bind:value={editingProject.projectUrl}
						/>
					</div>

					<input type="hidden" name="updatedAt" value={formatedTimestamp()} />

					<div class="dialog-actions">
						<button type="button" class="button button-secondary" onclick={closeEditDialog}>
							Cancel
						</button>
						<button
							type="submit"
							class="button"
							class:button-disabled={!hasChanges()}
							disabled={isSubmitting || !hasChanges()}
							title={!hasChanges() ? 'No changes to save' : ''}
						>
							{isSubmitting ? 'Updating...' : 'Update Project'}
						</button>
					</div>
				</form>
			</div>
		</dialog>
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
						{#if project.updatedAt && project.updatedAt !== project.createdAt}
							<p style="color: var(--gray-5); font-size: var(--font-size-1);">
								Updated: {new Date(project.updatedAt).toLocaleDateString()}
							</p>
						{/if}

						<div class="card-actions">
							<button
								type="button"
								class="button button-secondary"
								onclick={() => openEditDialog(project)}
							>
								Edit
							</button>
							<form
								method="POST"
								action="?/delete"
								style="display: inline;"
								use:enhance={() => {
									return async ({ update }) => {
										if (confirm('Are you sure you want to delete this project?')) {
											await update();
										}
									};
								}}
							>
								<input type="hidden" name="id" value={project.id} />
								<button type="submit" class="button button-danger"> Delete </button>
							</form>
						</div>
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

