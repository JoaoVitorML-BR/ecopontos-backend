import { IsNotEmpty, IsString, IsArray, Matches } from 'class-validator';

export class CreateEcoPointDto {
  companyId: string;

  @IsNotEmpty({ message: 'Título é obrigatório' })
  @IsString({ message: 'Título deve ser uma string' })
  title: string;

  @IsNotEmpty({ message: 'CNPJ é obrigatório' })
  @IsString({ message: 'CNPJ deve ser uma string' })
  cnpj: string;

  @IsNotEmpty({ message: 'Horário de funcionamento é obrigatório' })
  @IsString({ message: 'Horário de funcionamento deve ser uma string' })
  opening_hours: string;

  @IsNotEmpty({ message: 'Intervalo de coleta é obrigatório' })
  @IsString({ message: 'Intervalo de coleta deve ser uma string' })
  interval: string;

  @IsNotEmpty({ message: 'Materiais aceitos são obrigatórios' })
  @IsArray({ message: 'Materiais aceitos deve ser um array' })
  @IsString({ each: true, message: 'Cada material deve ser uma string' })
  accepted_materials: string[];

  @IsNotEmpty({ message: 'Endereço é obrigatório' })
  @IsString({ message: 'Endereço deve ser uma string' })
  address: string;

  @IsNotEmpty({ message: 'Coordenadas são obrigatórias' })
  @IsString({ message: 'Coordenadas devem ser uma string' })
  @Matches(/^[-+]?\d{1,2}\.\d+,\s*[-+]?\d{1,3}\.\d+$/, {
    message: 'Coordenadas devem estar no formato: latitude,longitude (ex: -9.741951520552348,-36.660397991379185)',
  })
  coordinates: string;
}
