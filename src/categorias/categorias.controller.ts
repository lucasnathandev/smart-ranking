import { AtualizarCategoriaDto } from './dtos/atualizarCategoria.dto';
import {
  Body,
  Param,
  Controller,
  Post,
  Get,
  Patch,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CriarCategoriaDto } from './dtos/criarCategoria.dto';
import { Categorias as Categoria } from '@prisma/client';
import { CategoriasService } from './categorias.service';

@Controller('api/v1/categorias')
export class CategoriasController {
  constructor(private readonly categoriaService: CategoriasService) {}

  @Get()
  async consultarCategorias(): Promise<Categoria[]> {
    return this.categoriaService.consultarTodasCategorias();
  }

  @Get('/:id')
  @UsePipes(ValidationPipe)
  async buscarCategoriaPeloId(@Param('id') id: string): Promise<Categoria> {
    return this.categoriaService.consultarCategoriaPeloId(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async criarCategoria(
    @Body() criarCategoriaDto: CriarCategoriaDto,
  ): Promise<Categoria> {
    return await this.categoriaService.criarCategoria(criarCategoriaDto);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  async atualizarCategoria(
    @Param('id') id: string,
    @Body() atualizarCategoriaDto: AtualizarCategoriaDto,
  ): Promise<Categoria> {
    return await this.categoriaService.atualizarCategoria(
      id,
      atualizarCategoriaDto,
    );
  }
}
