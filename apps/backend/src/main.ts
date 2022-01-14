import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as requestIp from 'request-ip';
import { filterRequest } from './app/middleware/filter.request.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(filterRequest);

  const configService = app.get(ConfigService);
  const globalPrefix = configService.get('BACKEND_PREFIX');
  app.setGlobalPrefix(globalPrefix);

  if (configService.get('ENVIRONMENT') === 'development' || 'stage') {
    const swaggerOptions = new DocumentBuilder()
      .setTitle('100Bet API documentation')
      .setDescription(
        'Below You can test out the backend api and read the description of all endpoints and it`s examples'
      )
      .setVersion('0.0.1')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'jwt',
      })
      .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);

    SwaggerModule.setup(globalPrefix, app, swaggerDocument, {
      swaggerUrl: `${configService.get('BACKEND_HOST')}/api/docs-json/`,
      explorer: true,
      swaggerOptions: {
        docExpansion: 'list',
        filter: true,
        displayRequestDuration: true,
      },
      customCss:
        '.opblock-summary-path {font-size: 18px !important; font-weight: normal !important;}' +
        '.opblock-summary-description {font-size: 18px !important; text-align: right !important;' +
        'font-weight: bold !important;}',
    });
  }
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      transform: true,
    })
  );

  app.use(requestIp.mw());

  app.enableCors({
    origin: true,
  });
  const port = configService.get('BACKEND_PORT');
  await app.listen(port);
}



bootstrap();
