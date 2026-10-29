import {
    IsNumber,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Min,
    IsDate,
} from 'class-validator';

import { Type } from 'class-transformer';

export class AtualizarComprovanteDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    objetoId?: number;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    descricao?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    dataRegistro?: Date;
}
