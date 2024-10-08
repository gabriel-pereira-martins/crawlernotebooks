import { Controller, Post, Body } from '@nestjs/common';
import { NotebooksService } from './notebooks.service';
import { NotebookFilterDto } from './DTOS/notebook.dto';

@Controller('notebooks')
export class NotebooksController {
  constructor(private readonly notebooksService: NotebooksService) {}

  @Post('filter')
  async findFilteredNotebooks(@Body() filterDto: NotebookFilterDto) {
    return await this.notebooksService.findNotebooks(filterDto);
  }
}
