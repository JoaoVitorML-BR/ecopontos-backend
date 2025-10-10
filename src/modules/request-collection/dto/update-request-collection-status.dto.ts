import { IsString, IsIn } from 'class-validator';

export class UpdateRequestCollectionStatusDto {
    @IsString()
    @IsIn(['pendente', 'aceita', 'em_coleta', 'finalizada', 'recusada'])
    status: string;
}
