import { Logger } from '@nestjs/common';
import { Options } from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

const logger = new Logger('MikroORM');
const config = {
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  dbName: process.env.DB_NAME,
  type: 'postgresql',
  host: 'localhost',
  port: Number(process.env.DB_PORT),
  highlighter: new SqlHighlighter(),
  debug: true,
  logger: logger.log.bind(logger),
  password: process.env.DB_PASSWORD,
  metadataProvider: TsMorphMetadataProvider,
} as Options;

export default config;
