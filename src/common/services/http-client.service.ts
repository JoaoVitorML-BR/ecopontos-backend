import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HttpClientService {
  constructor(private readonly httpService: HttpService) {}

  private cleanCnpj(cnpj: string): string {
    // Remove todos os caracteres não numéricos
    return cnpj.replace(/\D/g, '');
  }

  async validateCnpj(cnpj: string) {
    try {
      const cleanedCnpj = this.cleanCnpj(cnpj);
      
      if (cleanedCnpj.length !== 14) {
        throw new Error('CNPJ deve ter 14 dígitos');
      }

      const response = await firstValueFrom(
        this.httpService.get(`https://www.receitaws.com.br/v1/cnpj/${cleanedCnpj}`)
      );
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao validar CNPJ: ${error.message}`);
    }
  }

  async get(url: string, config?: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, config)
      );
      return response.data;
    } catch (error) {
      throw new Error(`Erro na requisição GET: ${error.message}`);
    }
  }

  async post(url: string, data: any, config?: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(url, data, config)
      );
      return response.data;
    } catch (error) {
      throw new Error(`Erro na requisição POST: ${error.message}`);
    }
  }

  async put(url: string, data: any, config?: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(url, data, config)
      );
      return response.data;
    } catch (error) {
      throw new Error(`Erro na requisição PUT: ${error.message}`);
    }
  }

  async delete(url: string, config?: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(url, config)
      );
      return response.data;
    } catch (error) {
      throw new Error(`Erro na requisição DELETE: ${error.message}`);
    }
  }
}
