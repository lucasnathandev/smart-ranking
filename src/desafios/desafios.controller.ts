import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  UsePipes,
  ValidationPipe,
  Query,
} from "@nestjs/common";
import { DesafiosService } from "./desafios.service";
import { CriarDesafioDto } from "./dto/criar-desafio.dto";
import { AtualizarDesafioDto } from "./dto/atualizar-desafio.dto";
import { Desafios as Desafio } from "@prisma/client";
import { DesafioStatusValidacaoPipe } from "./pipes/desafio-status-validation.pipe";
import { AtribuirDesafioPartidaDto } from "./dto/atribuir-desafio-partida.dto";

@Controller("api/v1/desafios")
export class DesafiosController {
  constructor(private readonly desafiosService: DesafiosService) {}

  private logger = new Logger(DesafiosController.name);

  @Post()
  @UsePipes(ValidationPipe)
  async criarDesafio(
    @Body() criarDesafioDto: CriarDesafioDto
  ): Promise<Desafio | any> {
    this.logger.log(`criarDesafioDto: ${JSON.stringify(criarDesafioDto)}`);
    return await this.desafiosService.criarDesafio(criarDesafioDto);
  }

  @Get()
  async consultarDesafios(@Query("idJogador") id: string): Promise<Desafio[]> {
    return id
      ? await this.desafiosService.consultarDesafiosDeUmJogador(id)
      : await this.desafiosService.consultarDesafios();
  }

  @Get("/:id")
  async findOne(@Param("id") id: string): Promise<Desafio> {
    return await this.desafiosService.encontrarDesafioPeloId(id);
  }

  @Patch("/:id")
  @UsePipes(DesafioStatusValidacaoPipe)
  async atualizarDesafio(
    @Body() atualizarDesafioDto: AtualizarDesafioDto,
    @Param("id") id: string
  ) {
    this.logger.log("atualizarDesafioDto " + atualizarDesafioDto);

    return await this.desafiosService.atualizarDesafio(id, atualizarDesafioDto);
  }

  @Post("/:id/partida")
  @UsePipes(ValidationPipe)
  atribuirDesafioPartida(
    @Body() atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto,
    @Param("id") desafioId: string
  ) {
    return this.desafiosService.atribuirDesafioPartida(
      desafioId,
      atribuirDesafioPartidaDto
    );
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.desafiosService.deletarDesafio(id);
  }
}
