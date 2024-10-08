import { Controller, Post, Body } from '@nestjs/common';
import { NotebooksService } from './notebooks.service';
import { NotebookFilterDto } from './DTOS/notebook.dto';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('notebooks')
@Controller('notebooks')
export class NotebooksController {
  constructor(private readonly notebooksService: NotebooksService) {}

  @Post()
  @ApiOperation({ summary: 'Filtra e retorna notebooks baseados no payload enviado' })
  @ApiBody({ type: NotebookFilterDto })
  findNotebooks(@Body() filterDto: NotebookFilterDto) {
    return this.notebooksService.findNotebooks(filterDto);
  }
}
