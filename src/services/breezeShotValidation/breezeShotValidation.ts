// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication';
import { hooks as schemaHooks } from '@feathersjs/schema';

import type { Application } from '../../declarations';
import { BreezeShotValidationService, getOptions } from './breezeShotValidation.class';
import { 
	breezeShotValidationValidator,
	breezeShotValidationResolver,
	breezeShotValidationExternalResolver,
	tokenValidationRequestValidator,
	tokenValidationRequestResolver
} from './breezeShotValidation.schema';

export * from './breezeShotValidation.class';
export * from './breezeShotValidation.schema';

// A configure function that registers the service and its hooks via `app.configure`
export const breezeShotValidation = (app: Application) => {
	// Register our service on the Feathers application
	app.use('breezeShotValidation', new BreezeShotValidationService(getOptions(app)), {
		// A list of all methods this service exposes externally
		methods: [ 'find', 'get', 'create', 'patch', 'remove' ],
		// You can add additional custom events to be sent to clients here
		events: []
	});
  
	// Initialize hooks
	app.service('breezeShotValidation').hooks({
		around: {
			all: [
				authenticate('jwt'),
				schemaHooks.resolveExternal(breezeShotValidationExternalResolver),
				schemaHooks.resolveResult(breezeShotValidationResolver)
			]
		},
		before: {
			all: [
				schemaHooks.validateData(tokenValidationRequestValidator),
				schemaHooks.resolveData(tokenValidationRequestResolver)
			],
			find: [],
			get: [],
			create: [],
			patch: [],
			remove: []
		},
		after: {
			all: []
		},
		error: {
			all: []
		}
	});
};

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'breezeShotValidation': BreezeShotValidationService
  }
}
