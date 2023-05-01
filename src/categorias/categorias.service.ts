import { AtualizarCategoriaDto } from './dtos/atualizarCategoria.dto';
import { PrismaService } from './../prisma/prisma.service';
import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CriarCategoriaDto } from './dtos/criarCategoria.dto';
import { Categorias as Categoria } from '@prisma/client';

@Injectable()
export class CategoriasService {
  constructor(private prisma: PrismaService) {}

  private readonly logger = new Logger('Categoria');
  private readonly categoriasModel = this.prisma.categorias;

  async consultarTodasCategorias(): Promise<Categoria[]> {
    try {
      const categorias = await this.categoriasModel.findMany();
      this.logger.log(categorias);
      return categorias;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async consultarCategoriaPeloId(id: string): Promise<Categoria | any> {
    try {
      const encontrado = await this.categoriasModel.findFirst({
        where: {
          id,
        },
      });

      if (!encontrado) {
        throw new NotFoundException('Categoria não encontrada');
      }
      this.logger.log(encontrado);
      return encontrado;
    } catch (error) {
      return { error: error.message };
    }
  }

  async criarCategoria(
    criarCategoriaDto: CriarCategoriaDto,
  ): Promise<Categoria | any> {
    try {
      const { categoria } = criarCategoriaDto;
      const categoriaExiste = await this.categoriasModel.findFirst({
        where: {
          categoria,
        },
      });
      if (categoriaExiste) {
        throw new BadRequestException(
          `Categoria ${categoria} já foi cadastrada.`,
        );
      }
      const criado = await this.categoriasModel.create({
        data: criarCategoriaDto,
      });
      this.logger.log(criado);
      return criado;
    } catch (error) {
      return { error: error.message };
    }
  }

  async atualizarCategoria(
    id: string,
    atualizarCategoriaDto: AtualizarCategoriaDto,
  ): Promise<Categoria | any> {
    try {
      const { categoria } = atualizarCategoriaDto;
      const categoriaExiste = await this.categoriasModel.findFirst({
        where: {
          categoria,
        },
      });
      if (categoriaExiste) {
        throw new BadRequestException(
          `Categoria ${categoria} já existe e não pode ser duplicada.`,
        );
      }
      const atualizado = await this.categoriasModel.update({
        where: {
          id,
        },
        data: atualizarCategoriaDto,
      });
      this.logger.log(atualizado);
      return atualizado;
    } catch (error) {
      return { error: error.message };
    }
  }
}
