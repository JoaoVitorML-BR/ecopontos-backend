export class EcoPointResponseDto {
  id: string;
  title: string;
  cnpj: string;
  opening_hours: string;
  interval: string;
  accepted_materials: string[];
  address: string;
  coordinates: string;
  createdAt?: Date;
  updatedAt?: Date;
}
