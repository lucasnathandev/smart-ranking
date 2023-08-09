import { JogadoresService } from "./../jogadores/jogadores.service";
import { AtualizarCategoriaDto } from "./dtos/atualizarCategoria.dto";
import { PrismaService } from "./../prisma/prisma.service";
import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { CriarCategoriaDto } from "./dtos/criarCategoria.dto";
import { Categorias as Categoria, Jogadores as Jogador } from "@prisma/client";

@Injectable()
export class CategoriasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jogadoresService: JogadoresService
  ) {}

  private readonly logger = new Logger("Categoria");
  private readonly categoriasModel = this.prisma.categorias;

  async consultarTodasCategorias(): Promise<Categoria[]> {
    try {
      const categorias = await this.categoriasModel.findMany({
        include: {
          jogadores: true,
        },
      });

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
        include: {
          jogadores: true,
        },
      });

      if (!encontrado) {
        throw new NotFoundException("Categoria não encontrada");
      }

      return encontrado;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async criarCategoria(
    criarCategoriaDto: CriarCategoriaDto
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
          `Categoria ${categoria} já foi cadastrada.`
        );
      }
      const criado = await this.categoriasModel.create({
        data: criarCategoriaDto,
      });

      return criado;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async atualizarCategoria(
    id: string,
    atualizarCategoriaDto: AtualizarCategoriaDto
  ): Promise<void | any> {
    try {
      const atualizado = await this.categoriasModel.update({
        where: {
          id,
        },
        data: atualizarCategoriaDto,
      });
      if (!atualizado) {
        throw new BadRequestException("Categoria não encontrada.");
      }
      this.logger.log(atualizado);

      return atualizado;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async atribuirCategoriaJogador(params: {
    id: string;
    idJogador: string;
  }): Promise<void> {
    try {
      const { id, idJogador } = params;

      const encontrado = await this.categoriasModel.findFirst({
        where: {
          id,
        },
        include: {
          jogadores: true,
        },
      });
      if (!encontrado) {
        throw new BadRequestException("Categoria não encontrada.");
      }

      const jogadorCadastrado = await this.categoriasModel.findFirst({
        where: {
          id,
          jogadores: {
            some: {
              id: idJogador,
            },
          },
        },
      });

      if (jogadorCadastrado) {
        throw new BadRequestException(
          "Jogador já está cadastrado na categoria " +
            jogadorCadastrado.categoria +
            "."
        );
      }

      const jogador: Jogador =
        await this.jogadoresService.consultarJogadorPeloId(idJogador);

      if (!jogador) {
        throw new BadRequestException("Jogador não encontrado.");
      }

      await this.jogadoresService.atualizarJogador(jogador.id, {
        categoriaId: id,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
