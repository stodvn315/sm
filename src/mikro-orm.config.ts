import { Logger } from '@nestjs/common';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { MikroOrmModuleAsyncOptions } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';

const logger = new Logger('MikroORM');
const mikroOrmConfig: MikroOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    type: 'postgresql',
    dbName: configService.get<string>('database.name'),
    user: configService.get<string>('database.user'),
    password: configService.get<string>('database.password'),
    host: configService.get<string>('database.host'),
    port: configService.get<number>('database.port'),
    debug: true,
    logger: logger.log.bind(logger),
    highlighter: new SqlHighlighter(),
    metadataProvider: TsMorphMetadataProvider,
  }),
};

export default mikroOrmConfig;
