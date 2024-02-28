import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configService from './config/configService.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from './api/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
// import { DatabaseService } from './utils/db.utils';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configService],
    }),
    // TypeOrmModule.forRootAsync({
    //   useClass: DatabaseService,
    // }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      // useFactory: This property specifies a function that returns an object containing the configuration options for the TypeORM connection.
      // useFactory is particularly useful when you need to fetch configuration values asynchronously, such as from environment variables or configuration files.
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('db').host,
          port: 3306,
          username: configService.get('db').username,
          password: configService.get('db').password,
          database: configService.get('db').dbname,
          entities: [
            'dist/entities/*.entity.{ts,js}',
            "src/entities/*.entity.{ts,js}'",
          ],
          // when we update the entities, synchronize will automatically update the database
          synchronize: configService.get('nodeEnv') === 'dev' ? true : false, // Should be false when going production.
        };
      },
      // This property is an array of tokens that represent the dependencies (services or values) that should be injected into the factory function.
      // Here it injects ConfigService to dynamically fetch configuration values.
      inject: [ConfigService],
    }),
    ApiModule,
    MailModule,
    JwtModule,
    MulterModule.registerAsync({
      useFactory: async (): Promise<MulterOptions> => ({
        dest: './public', 
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {}
}
