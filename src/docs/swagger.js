import swaggerJSDoc from 'swagger-jsdoc';

const options = {
	definition: {
		openapi: '3.0.3',
		info: {
			title: 'Alumni Network API',
			version: '1.0.0',
			description: 'REST API for Alumni Network',
		},
		servers: [
			{ url: '/api' },
		],
		components: {
			schemas: {},
			securitySchemes: {
				bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
			},
		},
		security: [{ bearerAuth: [] }],
	},
	apis: ['src/routes/*.js', 'src/controllers/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);
