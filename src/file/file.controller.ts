import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseFilePipeBuilder,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { createReadStream, existsSync } from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';

@Controller('file')
@ApiTags('File & Streams')
export class FileController {
  private uploadPath = './upload/files';

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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
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

  @Get('download/:filename')
  @ApiParam({
    name: 'filename',
    required: true,
    description: 'Name of the file to download',
    type: String,
  })
  @ApiQuery({
    name: 'disposition',
    required: false,
    description:
      'Especify how the file should be treated "inline" to display it "attachment" to download it',
    type: String,
    enum: ['inline', 'attachment'],
  })
  downloadFile(
    @Param('filename') filename: string,
    @Query('disposition') disposition: string = 'attachment',
    @Res({ passthrough: true }) res,
  ): StreamableFile {
    const filePath = join(process.cwd(), this.uploadPath, filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    const file = createReadStream(filePath);
    const contentDisposition =
      disposition === 'inline' ? 'inline' : 'attachment';

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `${contentDisposition}; filename="${filename}"`,
    });

    return new StreamableFile(file);
  }
}
