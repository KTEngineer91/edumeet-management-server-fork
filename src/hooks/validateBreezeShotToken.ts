import { Forbidden } from '@feathersjs/errors';
import { HookContext } from '../declarations';

export const validateBreezeShotToken = async (context: HookContext) => {
	const { params } = context;
	const token = params.query?.token;
  
	if (!token) {
		throw new Forbidden('Access token required');
	}
  
	try {
		// Validate token with BreezeShot via service create
		const validation = await context.app.service('breezeShotValidation').create({ token });
    
		if (!validation.success) {
			throw new Forbidden(validation.message || 'Invalid access token');
		}
    
		// Add user context to params
		context.params.breezeShotUser = validation.user;
		context.params.breezeShotRoom = {
			roomId: validation.roomId,
			topicId: validation.topicId
		};
    
		return context;
	} catch (error: unknown) {
		if (error instanceof Forbidden) {
			throw error;
		}

		throw new Forbidden('Failed to validate access token');
	}
};

export const validateBreezeShotTokenOptional = async (context: HookContext) => {
	const { params } = context;
	const token = params.query?.token;
  
	// If no token provided, skip validation (for backward compatibility)
	if (!token) {
		return context;
	}
  
	// If token is provided, validate it
	return await validateBreezeShotToken(context);
};
