import { Application } from '../declarations';
import Router from '@koa/router';

export const topicGroupRoutes = (app: Application) => {
	const router = new Router({ prefix: '/api/v1/topic-group' });

	// POST /api/v1/topic-group/validate-token
	router.post('/validate-token', async (ctx) => {
		try {
			const { token } = ctx.request.body;
			
			if (!token) {
				ctx.status = 400;
				ctx.body = { success: false, message: 'Token is required' };
				return;
			}

			// Direct validation with BreezeShot backend
			const breezeshotApiUrl = (app.get as any)('breezeShot')?.apiUrl || 'http://localhost:8000';
			
			try {
				const axios = await import('axios');
				const response = await axios.default.post(`${breezeshotApiUrl}/v1/topic-group/validate-token`, {
					token
				}, {
					timeout: 5000,
					headers: { 'Content-Type': 'application/json' }
				});
				
				ctx.status = response.data.success ? 200 : 400;
				ctx.body = response.data;
			} catch (error: any) {
				console.error('Failed to validate token with BreezeShot:', error.message);
				ctx.status = 400;
				ctx.body = { success: false, message: 'Failed to validate token with BreezeShot' };
			}
		} catch (error: any) {
			console.error('Error validating token:', error);
			ctx.status = 500;
			ctx.body = { success: false, message: 'Internal server error' };
		}
	});

	// GET /api/v1/topic-group/validate-edumeet-room
	router.get('/validate-edumeet-room', async (ctx) => {
		try {
			const { userKey, roomId, topicId } = ctx.query;
			
			if (!userKey || !roomId || !topicId) {
				ctx.status = 400;
				ctx.body = { success: false, message: 'userKey, roomId, and topicId are required' };
				return;
			}

			// Direct validation with BreezeShot backend
			const breezeshotApiUrl = (app.get as any)('breezeShot')?.apiUrl || 'http://localhost:8000';
			
			try {
				const axios = await import('axios');
				const response = await axios.default.get(`${breezeshotApiUrl}/v1/topic-group/validate-edumeet-room`, {
					params: { userKey, roomId, topicId },
					timeout: 5000,
					headers: { 'Content-Type': 'application/json' }
				});
				
				ctx.status = response.data.success ? 200 : 400;
				ctx.body = response.data;
			} catch (error: any) {
				console.error('Failed to validate user access with BreezeShot:', error.message);
				ctx.status = 400;
				ctx.body = { success: false, message: 'Failed to validate user access with BreezeShot' };
			}
		} catch (error: any) {
			console.error('Error validating user access:', error);
			ctx.status = 500;
			ctx.body = { success: false, message: 'Internal server error' };
		}
	});

	app.use(router.routes());
	app.use(router.allowedMethods());
};
