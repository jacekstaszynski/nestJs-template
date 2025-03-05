import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface AppConfig {
  port: number;
}

@Injectable()
export class ConfigurationService implements AppConfig {
  readonly port: number;
  readonly env: 'local' | 'dev' | 'staging' | 'prod' | 'test';
  readonly database: {
    url: string;
  };
  readonly binance: {
    apiKey: string;
    apiSecret: string;
  };
  readonly moralis: {
    apiKey: string;
  };

  constructor(private configService: ConfigService) {
    this.port = this.configService.get('PORT');
    this.env = this.configService.get('ENV');
    this.database = {
      url: this.configService.get('DATABASE_URL'),
    };
    this.binance = {
      apiKey: this.configService.get('BINANCE_API_KEY'),
      apiSecret: this.configService.get('BINANCE_API_SECRET'),
    };
    this.moralis = {
      apiKey: this.configService.get('MORALIS_API_KEY'),
    };
  }
}
