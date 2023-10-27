import { Global, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: configService.get<string>('UPLOADS_DIR'),
          filename: (req: any, file: any, cb: any) => {
            const generatedName = uuid() + extname(file.originalname);
            //console.debug(generatedName);
            cb(null, generatedName);
          },
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],

  providers: [],
  exports: [MulterModule],
})
export class FilesModule {}
