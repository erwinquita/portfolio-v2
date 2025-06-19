import { db } from '$lib/server/db';
import { portfolio } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const projects = await db
			.select()
			.from(portfolio)
			.orderBy(desc(portfolio.createdAt));

		return {
			projects
		};
	} catch (error) {
		console.error('Error loading portfolio projects:', error);
		return {
			projects: []
		};
	}
};
