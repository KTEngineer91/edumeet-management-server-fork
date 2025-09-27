// Schema for BreezeShot validation service
import { resolve } from '@feathersjs/schema';
import { Type, getValidator } from '@feathersjs/typebox';
import type { Static } from '@feathersjs/typebox';

import type { HookContext } from '../../declarations';
import { dataValidator } from '../../validators';

// Main data model schema
export const breezeShotValidationSchema = Type.Object(
	{
		id: Type.Number(),
		token: Type.String(),
		userKey: Type.String(),
		roomId: Type.String(),
		topicId: Type.String(),
		isValid: Type.Boolean(),
		message: Type.Optional(Type.String()),
		user: Type.Optional(Type.Object({}))
	},
	{ $id: 'BreezeShotValidation', additionalProperties: false }
);

export type BreezeShotValidation = Static<typeof breezeShotValidationSchema>;
export const breezeShotValidationValidator = getValidator(breezeShotValidationSchema, dataValidator);
export const breezeShotValidationResolver = resolve<BreezeShotValidation, HookContext>({});

export const breezeShotValidationExternalResolver = resolve<BreezeShotValidation, HookContext>({
	// Hide sensitive information
	token: async () => undefined,
	userKey: async () => undefined
});

// Schema for token validation request
export const tokenValidationRequestSchema = Type.Object(
	{
		token: Type.String()
	},
	{ $id: 'TokenValidationRequest', additionalProperties: false }
);

export type TokenValidationRequest = Static<typeof tokenValidationRequestSchema>;
export const tokenValidationRequestValidator = getValidator(tokenValidationRequestSchema, dataValidator);
export const tokenValidationRequestResolver = resolve<TokenValidationRequest, HookContext>({});
