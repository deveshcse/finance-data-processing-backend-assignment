import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env.js";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Finance Dashboard API",
      version: "1.0.0",
      description: "A comprehensive API for managing personal or business finances with RBAC. Supports JWT Access Tokens and Refresh Token Rotation.",
      contact: {
        name: "Developer",
      },
    },
    servers: [
      {
        url: env.SERVER_URL,
        description: env.NODE_ENV === "production" ? "Production server" : "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Path to the API docs
  apis: ["./src/modules/**/*.routes.js", "./src/app.js"], 
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
