import { AllExceptionsFilter } from './common/filters/httpException.filter';
import { PrismaService } from './prisma/prisma.service';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config/dist';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule, { abortOnError: false });
  app.useGlobalFilters(new AllExceptionsFilter());
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  app.enableCors({
    origin: ['loopback'],
    allowedHeaders: [
      'Accept',
      'Authorization',
      'Content-Type',
      'Cache-Control',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });

  app.use(
    helmet({
      xssFilter: true,
      frameguard: true,
      hidePoweredBy: true,
      noSniff: true,
      ieNoOpen: true,
    }),
  );

  const config = app.get<ConfigService>(ConfigService);
  const nodeEnv = config.get<string>('nodeEnv') || 'development';
  const port = config.get<number>('PORT') || 8000;

  await app.listen(port, () => {
    logger.log('Server listening at ' + port);
    logger.log('Running on mode: ' + nodeEnv);
  });
}
bootstrap();
