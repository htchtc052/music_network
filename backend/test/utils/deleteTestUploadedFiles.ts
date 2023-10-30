import { readdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

export const deleteTestUploadedFiles = (moduleFixture: TestingModule): void => {
  const configService = moduleFixture.get<ConfigService>(ConfigService);
  const uploadsDir = configService.get('UPLOADS_DIR');
  const files = readdirSync(uploadsDir);

  files.forEach((file) => {
    const filePath = join(uploadsDir, file);
    try {
      unlinkSync(filePath);
      console.log(`Deleted test file ${filePath}`);
    } catch (err) {
      console.error(`Failed to delete test file ${filePath}`);
      console.error(err);
    }
  });
};
