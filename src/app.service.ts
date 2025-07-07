import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Bem-vindo ao Backend do Eco Arapiraca! 🌱';
  }
}
