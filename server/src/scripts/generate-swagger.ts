// src/scripts/generate-swagger.ts
import fs from 'fs';
import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from '../config/swagger';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const spec = swaggerJsdoc(swaggerOptions);

const outputPath = path.join(__dirname, '..', '..', 'swagger-output.json');

fs.writeFileSync(outputPath, JSON.stringify(spec, null, 2), 'utf-8');

console.log('Swagger JSON written to', outputPath);
