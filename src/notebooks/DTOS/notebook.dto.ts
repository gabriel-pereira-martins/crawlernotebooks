import { ApiProperty } from '@nestjs/swagger';

export class NotebookFilterDto {
  @ApiProperty({ description: 'Modelos de notebooks a serem buscados', example: ['Lenovo'], required: false })
  Models: string[];

  @ApiProperty({ description: 'Ordenação do preço (ASC ou DESC)', example: 'ASC', required: false })
  Order: string;
}
