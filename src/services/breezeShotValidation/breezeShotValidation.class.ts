import { KnexService } from '@feathersjs/knex';
import axios from 'axios';

export class BreezeShotValidationService extends KnexService {
	private readonly breezeshotApiUrl = process.env.BREEZESHOT_API_URL || 'http://localhost:3002';
  
	async validateToken(token: string) {
		try {
			const response = await axios.post(`${this.breezeshotApiUrl}/v1/topic-group/validate-token`, {
				token
			}, {
				timeout: 5000, // 5 second timeout
				headers: {
					'Content-Type': 'application/json'
				}
			});
      
			return response.data;
		} catch (error: any) {
			console.error('Failed to validate token with BreezeShot:', error.message);
			
			return {
				success: false,
				message: 'Failed to validate token with BreezeShot'
			};
		}
	}
  
	async validateUserAccess(userKey: string, roomId: string, topicId: string) {
		try {
			const response = await axios.get(`${this.breezeshotApiUrl}/v1/topic-group/validate-edumeet-room`, {
				params: { userKey, roomId, topicId },
				timeout: 5000,
				headers: {
					'Content-Type': 'application/json'
				}
			});
      
			return response.data;
		} catch (error: any) {
			console.error('Failed to validate user access with BreezeShot:', error.message);
			
			return {
				success: false,
				message: 'Failed to validate user access with BreezeShot'
			};
		}
	}
}

export const getOptions = (app: any) => {
	return {
		paginate: app.get('paginate'),
		Model: app.get('postgresqlClient'),
		name: 'breezeShotValidation'
	};
};
