import { IsMongoId, IsInt, Min } from 'class-validator';

export class CreateRequestCollectionDto {
    @IsMongoId()
    ecopointId: string;

    @IsInt()
    @Min(50)
    quantity: number;
}
