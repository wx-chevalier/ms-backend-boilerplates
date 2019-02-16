require('dotenv').config();

import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { DispatchErrorFilter } from './application/filter/DispatchErrorFilter';

import { ApplicationModule } from './application/ApplicationModule';

const instance = express();

/* 声明 Express Middleware */
instance.use(
  bodyParser.json({
    type: '*/json',
  })
);
instance.use(bodyParser.urlencoded({ extended: false }));
/* 结束声明 Express Middleware */

async function bootstrap(): Promise<any> {
  const app = await NestFactory.create(ApplicationModule, instance);
  /* App filters. */
  app.useGlobalFilters(new DispatchErrorFilter());
  /* End of app filters. */
  await app.listen(3000);
}

bootstrap().then(() => console.log('Application is listening on port 3000.'));
