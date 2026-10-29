
import { IsInt, Min } from 'class-validator';
import { RegistrarDevolucaoDto } from './registrar-devolucao.dto.js';

export class CriarDevolucaoDto extends RegistrarDevolucaoDto {
  @IsInt()
  @Min(1)
  objetoId: number;
}