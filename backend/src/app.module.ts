import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import * as Joi from 'joi';
import * as process from 'process';
import { JwtAuthGuard } from './auth/guards/jwtAuthGuard';
import { APP_GUARD } from '@nestjs/core';
import { CaslModule } from './casl/casl.module';
import { AccountModule } from './account/account.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    JwtModule.register({ global: true }),
    CaslModule,
    AccountModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        FRONTEND_URL: Joi.string().required(),
        BACKEND_URL: Joi.string().required(),
        UPLOADS_DIR: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_ACCESS_LIFE: Joi.string().required(),
        JWT_REFRESH_LIFE: Joi.string().required(),
        SMTP_HOST: Joi.string(),
        SMTP_PORT: Joi.number(),
        SMTP_USER: Joi.string(),
        SMTP_PASS: Joi.string().allow(''),
        MAIL_PREVIEW_BROWSER: Joi.boolean().default(false),
        PRISMA_LOG: Joi.string().default('warn'),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    PrismaModule.forRootAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        //  console.debug(
        //   `Prisma before connect to database: ${process.env.DATABASE_URL}`,
        // );

        return {
          prismaOptions: {
            log: configService.get('PRISMA_LOG').split(','),
          },
        };
      },
      inject: [ConfigService],
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const rootPath = join(
          __dirname,
          '..',
          configService.get('UPLOADS_DIR'),
        );
        return [{ rootPath }];
      },
      inject: [ConfigService], // добавляем зависимость ConfigService
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtService,
  ],
})
export class AppModule {}
