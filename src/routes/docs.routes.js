import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { openapiSpec } from '../lib/openapi.js';

export const docsRouter = Router();

docsRouter.use('/', swaggerUi.serve);
docsRouter.get('/', swaggerUi.setup(openapiSpec, {
  customSiteTitle: 'Equipment API Docs',
  swaggerOptions: { persistAuthorization: true },
}));
