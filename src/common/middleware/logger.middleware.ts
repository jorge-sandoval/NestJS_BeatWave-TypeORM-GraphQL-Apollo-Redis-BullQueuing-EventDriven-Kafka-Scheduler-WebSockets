import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const start = Date.now();

    this.logger.log(
      `Incoming request: ${method} ${originalUrl} ${new Date(start).toISOString()}`,
    );

    res.on('finish', () => {
      const duration = Date.now() - start;
      this.logger.log(
        `Response: ${method} ${originalUrl} ${res.statusCode} ${duration}ms`,
      );
    });

    next();
  }
}
