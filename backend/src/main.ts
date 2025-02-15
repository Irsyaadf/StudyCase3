/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ErrorFilter } from './middleware/error.middleware';
import * as dotenv from 'dotenv';
dotenv.config();

console.log('DATABASE_URL:', process.env.DATABASE_URL);
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapter = app.getHttpAdapter();
  const server = httpAdapter.getInstance();
  console.log("🚀 NestJS Starting...");

  console.log("✅ NestJS Created");
  
  console.log(`📡 Server is running on http://localhost:3000`);

  app.enableCors();

  app.use(new LoggerMiddleware().use);

  app.useGlobalFilters(new ErrorFilter());

  app.enableCors({
    origin: "http://localhost:3001",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });

  const availableRoutes = server._router?.stack
    .filter((layer) => layer.route)
    .map((layer) => ({
      method: Object.keys(layer.route.methods)[0].toUpperCase(),
      path: layer.route.path,
    }));

  Logger.log(`🚀 Available Routes:`, 'Routes');
  console.table(availableRoutes);
  

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
