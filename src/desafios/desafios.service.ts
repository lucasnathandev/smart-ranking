import { AtribuirDesafioPartidaDto } from "./dto/atribuir-desafio-partida.dto";

import { PrismaService } from "./../prisma/prisma.service";

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { CriarDesafioDto } from "./dto/criar-desafio.dto";
import { AtualizarDesafioDto } from "./dto/atualizar-desafio.dto";
import { JogadoresService } from "src/jogadores/jogadores.service";
import { CategoriasService } from "src/categorias/categorias.service";
import { DesafioStatus } from "./interfaces/desafio-status.enum";

@Injectable()
export class DesafiosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jogadoresService: JogadoresService,
    private readonly categoriasService: CategoriasService
  ) {}
  private readonly logger = new Logger(DesafiosService.name);
  private readonly desafioModel = this.prisma.desafios;
  private readonly partidaModel = this.prisma.partidas;

  async criarDesafio(criarDesafioDto: CriarDesafioDto) {
    try {
      const { solicitante, jogadores, dataHoraDesafio } = criarDesafioDto;

      const jogadorRepetidoNoDesafio = jogadores[0] === jogadores[1];

      if (jogadorRepetidoNoDesafio)
        throw new BadRequestException(
          "Jogadores informados no desafio devem ser diferentes."
        );

      const jogadoresExistem =
        (await this.jogadoresService.consultarTodosJogadores()).filter(
          (jogador) => jogadores.includes(jogador.id)
        ).length === 2;

      if (!jogadoresExistem)
        throw new NotFoundException(
          "Um ou mais jogadores informados não existem"
        );

      const validarSolicitanteComoJogadorDaPartida =
        jogadores.includes(solicitante);

      if (!validarSolicitanteComoJogadorDaPartida)
        throw new ForbiddenException(
          "O solicitante não pode estar fora do desafio."
        );
      const jogadorSolicitante =
        await this.jogadoresService.consultarJogadorPeloId(solicitante);
      this.logger.log(
        "jogadorSolicitante: " + JSON.stringify(jogadorSolicitante)
      );

      const jogadorTemCategoria = jogadorSolicitante.categoriaId;

      if (!jogadorTemCategoria)
        throw new BadRequestException("O jogador precisa ter uma categoria");

      const desafioCriado = await this.desafioModel.create({
        data: {
          solicitante: {
            connect: {
              id: solicitante,
            },
          },
          dataHoraDesafio:
            dataHoraDesafio instanceof Date
              ? dataHoraDesafio
              : new Date(dataHoraDesafio),
          status: DesafioStatus.PENDENTE,
          partida: {},
          categoria: { connect: { id: jogadorSolicitante.categoriaId } },
          jogadores: {
            connect: jogadores.map((jogador) => ({ id: jogador })),
          },
        },
      });

      return desafioCriado;
    } catch (error: any) {
      this.logger.log(error.message);
      return { error };
    }
  }

  async consultarDesafios() {
    const desafios = await this.desafioModel.findMany({
      include: {
        partida: true,
        categoria: true,
        jogadores: true,
        solicitante: true,
      },
    });
    return desafios;
  }

  async consultarDesafiosDeUmJogador(idJogador: string) {
    const desafiosDoJogador = await this.desafioModel.findMany({
      where: {
        jogadores: { some: { id: idJogador } },
      },
      include: {
        partida: true,
        categoria: true,
        jogadores: true,
        solicitante: true,
      },
    });

    if (!desafiosDoJogador.length)
      throw new NotFoundException("O jogador não tem desafios");
    return desafiosDoJogador;
  }

  async encontrarDesafioPeloId(id: string) {
    const desafio = await this.desafioModel.findFirst({
      where: {
        id,
      },
      include: {
        partida: true,
        categoria: true,
        jogadores: true,
        solicitante: true,
      },
    });
    return desafio;
  }

  async atualizarDesafio(id: string, atualizarDesafioDto: AtualizarDesafioDto) {
    const { dataHoraDesafio, status } = atualizarDesafioDto;

    const respostaAtualizada = status ? new Date() : null;

    const desafioAtualizado = await this.desafioModel.update({
      where: {
        id,
      },
      data: {
        dataHoraResposta: respostaAtualizada,
        dataHoraDesafio,
        status,
      },
    });

    return desafioAtualizado;
  }

  async atribuirDesafioPartida(
    desafioId,
    atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto
  ) {
    const desafioEncontrado = await this.desafioModel.findFirst({
      where: {
        id: desafioId,
      },
      include: {
        jogadores: true,
      },
    });

    if (!desafioEncontrado)
      throw new BadRequestException(`Desafio ${desafioId} não existe`);

    const jogadorFazParteDesafio = desafioEncontrado.jogadores.find(
      (jogador) => jogador.id == atribuirDesafioPartidaDto.def
    );

    if (!jogadorFazParteDesafio)
      throw new BadRequestException(
        "O Jogador vencedor não faz parte do desafio!"
      );

    const partidaCriada = await this.partidaModel.create({
      data: {
        ...atribuirDesafioPartidaDto,
        jogadores: {
          connect: desafioEncontrado.jogadoresIds.map((jId) => ({ id: jId })),
        },
        categoria: {
          connect: {
            id: desafioEncontrado.categoriaId,
          },
        },
        desafios: {
          connect: {
            id: desafioEncontrado.id,
          },
        },
      },
    });

    const completarDesafio = await this.desafioModel.update({
      where: {
        id: desafioEncontrado.id,
      },
      data: { status: "REALIZADO" },
    });

    return partidaCriada;
  }

  async deletarDesafio(id: string) {
    const desafioDeletado = await this.desafioModel.update({
      where: { id },
      data: {
        status: "CANCELADO",
      },
    });
    return desafioDeletado;
  }
}
