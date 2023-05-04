import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { CriarDesafioDto } from './dto/criar-desafio.dto';
import { AtualizarDesafioDto } from './dto/atualizar-desafio.dto';

@Controller('api/v1/desafios')
export class DesafiosController {
  constructor(private readonly desafiosService: DesafiosService) {}

  @Post()
  create(@Body() CriarDesafioDto: CriarDesafioDto) {
    return this.desafiosService.create(CriarDesafioDto);
  }

  @Get()
  findAll() {
    return this.desafiosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.desafiosService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() AtualizarDesafioDto: AtualizarDesafioDto,
  ) {
    return this.desafiosService.update(+id, AtualizarDesafioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.desafiosService.remove(+id);
  }
}
