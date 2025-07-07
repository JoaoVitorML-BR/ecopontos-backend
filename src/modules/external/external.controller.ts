import { Controller, Get, Param } from '@nestjs/common';
import { HttpClientService } from '../../common/services/http-client.service';

@Controller('external')
export class ExternalController {
  constructor(private readonly httpClientService: HttpClientService) {}

  @Get('cnpj/:cnpj')
  async validateCnpj(@Param('cnpj') cnpj: string) {
    try {
      const cnpjInfo = await this.httpClientService.validateCnpj(cnpj);
      return {
        success: true,
        data: cnpjInfo
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}
