import { PartialType } from '@nestjs/mapped-types';
import { CriarDesafioDto } from './criar-desafio.dto';

export class AtualizarDesafioDto extends PartialType(CriarDesafioDto) {}
