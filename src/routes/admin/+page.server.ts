import { db } from '$lib/server/db';
import { portfolios, users } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const featuredProjects = await db
			.select()
			.from(portfolios)
			.orderBy(desc(portfolios.createdAt));

		return {
			featuredProjects
		};
	} catch (error) {
		console.error('Error loading projects:', error);
		return {
			projects: []
		};
	}
};

export const actions: Actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const title = data.get('title') as string;
		const description = data.get('description') as string;
		const projectUrl = data.get('projectUrl') as string;
		const imageUrl = data.get('imageUrl') as string;

		// Basic validation
		if (!title || !description || !projectUrl) {
			return fail(400, {
				error: 'All fields are required.',
				data: { title, description, projectUrl, imageUrl }
			});
		}

		// URL validation
		try {
			new URL(projectUrl);
		} catch {
			return fail(400, {
				error: 'Please enter a valid URL.',
				data: { title, description, projectUrl, imageUrl }
			});
		}

		try {
			// Get any existing user (you can replace this logic with auth-based user later)
			const [user] = await db.select().from(users).limit(1);

			if (!user) {
				throw new Error('No user found. Create a user first.');
			}

			await db.insert(portfolios).values({
				title,
				description,
				projectUrl,
				imageUrl,
				userId: user.id // ✅ Required foreign key
			});

			return {
				success: true
			};
		} catch (error) {
			console.error('Error creating project:', error);
			return fail(500, {
				error: 'Failed to create project. Please try again.',
				data: { title, description, projectUrl }
			});
		}
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const id = parseInt(data.get('id') as string);

		if (!id) {
			return fail(400, {
				error: 'Invalid project ID.'
			});
		}

		try {
			await db.delete(portfolios).where(eq(portfolios.id, id));

			return {
				success: true
			};
		} catch (error) {
			console.error('Error deleting project:', error);
			return fail(500, {
				error: 'Failed to delete project. Please try again.'
			});
		}
	}
};
