import { db } from '$lib/server/db';
import { portfolios } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const featuredProjects = await db
			.select()
			.from(portfolios)
			.orderBy(desc(portfolios.createdAt))
			.limit(3);

		return {
			featuredProjects
		};
	} catch (error) {
		console.error('Error loading featured projects:', error);
		return {
			featuredProjects: []
		};
	}
};
