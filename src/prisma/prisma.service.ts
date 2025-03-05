import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import type { ConfigurationService } from '../config/config/configuration.service';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(configurationService: ConfigurationService) {
    super({
      datasources: {
        db: {
          url: configurationService.database.url,
        },
      },
    });
  }
}
