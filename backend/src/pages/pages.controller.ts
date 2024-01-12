import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { SerializerInterceptor } from '../commons/serializerInterceptor';
import { AuthUser } from '../auth/decorators/authUser.decorator';
import { Page, User } from '@prisma/client';
import { Public } from '../auth/decorators/public.decorator';
import { CheckPolicies } from '../casl/policies.decorator';
import { PoliciesGuard } from '../casl/policies.guard';
import { PagesService } from './pages.service';
import { PageResponse } from './dtos/page.response';
import { EditPageInfoDto } from './dtos/editPageInfo.dto';
import { CurrentPage } from './decorators/currentPage.decorator';
import { EditPageHandler } from '../casl/policies/editPage.handler';
import { FileInterceptor } from '@nestjs/platform-express';
import { TrackResponse } from '../tracks/dtos/track.response';
import { TracksService } from '../tracks/tracks.service';
import { TransformTrackInterceptor } from '../tracks/interceptors/transormTrack.interceptor';

@Controller('pages')
export class PagesController {
  constructor(
    private pagesService: PagesService,
    private tracksService: TracksService,
  ) {}

  @ApiOperation({ summary: 'Get page by slug' })
  @HttpCode(HttpStatus.OK)
  @Public()
  @Get(':slug')
  getPage(@CurrentPage() page: Page): PageResponse {
    return new PageResponse(page);
  }

  @ApiOperation({ summary: 'Edit page info' })
  @HttpCode(HttpStatus.OK)
  @Put(':slug/editPageInfo')
  @CheckPolicies(EditPageHandler)
  @UseGuards(PoliciesGuard)
  editInfo(
    @CurrentPage() page: Page,
    @Body() editPageInfoDto: EditPageInfoDto,
  ): Promise<PageResponse> {
    return this.pagesService.editPageInfo(page, editPageInfoDto);
  }

  @Delete(':slug/deletePage')
  @CheckPolicies(EditPageHandler)
  @UseGuards(PoliciesGuard)
  async deletePage(@CurrentPage() page: Page): Promise<string> {
    const deletedPage: Page = await this.pagesService.markPageDeleted(page);

    return `Page ${deletedPage.id} successfully deleted`;
  }

  @ApiOperation({ summary: 'Get page tracks' })
  @HttpCode(HttpStatus.OK)
  @Public()
  @Get(':slug/tracks')
  @UseInterceptors(TransformTrackInterceptor)
  getPageTracks(
    @CurrentPage() page: Page,
    @AuthUser() authUser: User,
  ): Promise<TrackResponse[]> {
    return this.tracksService.getTracksByPage(page, authUser);
  }

  @ApiOperation({ summary: 'Upload track to page' })
  @HttpCode(HttpStatus.CREATED)
  @CheckPolicies(EditPageHandler)
  @UseGuards(PoliciesGuard)
  @Post(':slug/uploadTrack')
  @UseInterceptors(
    FileInterceptor('trackFile', {
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'audio/mpeg') {
          cb(null, true);
        } else {
          cb(new BadRequestException('File must be an mp3'), false);
        }
      },
    }),
  )
  @UseInterceptors(SerializerInterceptor)
  uploadTrack(
    @CurrentPage() page: Page,
    @UploadedFile()
    uploadedTrackFile: Express.Multer.File,
  ): Promise<TrackResponse> {
    return this.tracksService.createTrackByUploadedFile(
      page,
      uploadedTrackFile,
    );
  }
}
