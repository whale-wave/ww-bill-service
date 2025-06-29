import { expressHttpLogger } from '@avanlan/logger';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import * as compression from 'compression';
import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';
import { json, urlencoded } from 'express';
import * as session from 'express-session';
import helmet from 'helmet';
import { AppModule } from './app.module';
import config from './config';
import { AssetService } from './modules/asset/asset.service';
import { UserService } from './modules/user/user.service';
import { logger } from './utils';

dayjs.extend(isBetween);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: [
      /^https?:\/\/localhost(:\d+)?$/,
      /^https?:\/\/([\w-]+\.)*easyhappy\.top$/,
    ],
    credentials: true,
  });
  app.use(helmet());
  app.use(compression());
  app.use(
    session({
      secret: config.secret,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.use(expressHttpLogger(logger));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.setGlobalPrefix('api');

  const docConfig = new DocumentBuilder()
    .setTitle('鲸浪账本api文档')
    .setDescription('技术团队：Avan、LiangJinJun')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'Token',
    )
    .build();
  const options: SwaggerDocumentOptions = {
    ignoreGlobalPrefix: false,
  };
  const customOptions: SwaggerCustomOptions = {
    customSiteTitle: '鲸浪账本api文档',
  };
  const document = SwaggerModule.createDocument(app, docConfig, options);
  SwaggerModule.setup('doc', app, document, customOptions);

  const userService = app.get(UserService);
  userService.createSystemAdmin();
  const assetService = app.get(AssetService);
  assetService.updateAssetStatisticalRecordAllUser();

  await app.listen(3001);
}

void bootstrap();
