import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder().setTitle('MyMusic App API').build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        const errorMessages = errors.reduce((acc, error) => {
          const constraints = Object.values(error.constraints);
          const propertyName = error.property;
          const errorMessage = constraints[0];

          return { ...acc, [propertyName]: errorMessage };
        }, {});

        throw new BadRequestException({ errorMessages });
      },
    }),
  );

  await app.listen(3000);
}

bootstrap();
