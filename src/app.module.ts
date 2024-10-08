import { Module } from '@nestjs/common';
import { NotebooksController } from './notebooks/notebooks.controller';
import { NotebooksService } from './notebooks/notebooks.service';

@Module({
  imports: [],
  controllers: [NotebooksController],
  providers: [NotebooksService],
})
export class AppModule {}
