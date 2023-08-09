import { PipeTransform, BadRequestException, Logger } from "@nestjs/common";

import { DesafioStatus } from "../interfaces/desafio-status.enum";

export class DesafioStatusValidacaoPipe implements PipeTransform {
  private readonly logger = new Logger(DesafioStatusValidacaoPipe.name);
  readonly statusPermitidos = [
    DesafioStatus.ACEITO,
    DesafioStatus.NEGADO,
    DesafioStatus.CANCELADO,
  ];

  transform(value: any) {
    const status = value.status ? value.status.toUpperCase() : null;
    if (status && !this.ehStatusValido(status)) {
      throw new BadRequestException(`${status} é um status inválido.`);
    }
    return value;
  }

  private ehStatusValido(status: any) {
    const idx = this.statusPermitidos.indexOf(status);

    return idx !== -1;
  }
}
