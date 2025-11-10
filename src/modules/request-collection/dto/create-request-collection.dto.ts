import { IsMongoId, IsInt, Min, IsString, IsNotEmpty } from 'class-validator';

export class CreateRequestCollectionDto {
    @IsMongoId()
    ecopointId: string;

    @IsInt()
    @Min(50)
    quantity: number;

    @IsString()
    @IsNotEmpty()
    material: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}
