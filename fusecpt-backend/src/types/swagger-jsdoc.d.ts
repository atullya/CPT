declare module "swagger-jsdoc" {
  export interface SwaggerDefinition {
    openapi: string;
    info: {
      title: string;
      version: string;
      description?: string;
    };
    servers?: Array<{ url: string }>;
    components?: any;
    security?: any;
  }

  export interface Options {
    definition: SwaggerDefinition;
    apis: string[];
  }

  export default function swaggerJsdoc(options: Options): object;
}
