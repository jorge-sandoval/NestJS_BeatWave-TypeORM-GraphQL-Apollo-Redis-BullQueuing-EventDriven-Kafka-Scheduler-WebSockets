import {
  Controller,
  Get,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthenticatedGaurd } from './auth/guards/authenticated.guard';
import { ApiKeyGuard } from './auth/guards/api-key.guard';
import { TransformInterceptor } from '@common/interceptors/transform.interceptor';
import { User } from '@entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller()
@ApiTags('Demo')
@UseInterceptors(new TransformInterceptor(User))
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthenticatedGaurd)
  getProfile(@Req() request) {
    return request.user;
  }

  @Get('apiprofile')
  @ApiBearerAuth('API-Key-auth')
  @UseGuards(ApiKeyGuard)
  getProfileWithApiKey(
    @Req()
    request,
  ) {
    return request.user;
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload/files',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return {
      messge: 'file uploaded successfully!',
    };
  }

  @Post('upload-png')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload/files',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  uploadPngFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'png',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    console.log(file);
    return {
      messge: 'file uploaded successfully!',
    };
  }
}
