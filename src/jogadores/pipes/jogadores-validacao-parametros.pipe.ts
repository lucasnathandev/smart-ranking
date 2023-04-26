import {
  PipeTransform,
  ArgumentMetadata,
  Logger,
  BadRequestException,
} from '@nestjs/common';

export class JogadoresValidacaoParametrosPipe implements PipeTransform {
  private logger = new Logger();
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException(
        `Não foi passado nenhum valor no parâmetro ${metadata.data}`,
      );
      return;
    }
    this.logger.log(`value: ${value}, metadata: ${metadata.type}`);

    return value;
  }
}
