import { PrismaService } from "./../prisma/prisma.service";
import { Module } from "@nestjs/common";
import { DesafiosService } from "./desafios.service";
import { DesafiosController } from "./desafios.controller";
import { JogadoresService } from "src/jogadores/jogadores.service";
import { CategoriasService } from "src/categorias/categorias.service";

@Module({
  controllers: [DesafiosController],
  providers: [
    DesafiosService,
    PrismaService,
    JogadoresService,
    CategoriasService,
  ],
})
export class DesafiosModule {}
