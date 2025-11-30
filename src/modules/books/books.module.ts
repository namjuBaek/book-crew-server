import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksController } from './controller/books.controller';
import { BooksService } from './service/books.service';
import { BooksRepository } from './repository/books.repository';
import { Book } from './entity/book.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Book])],
    controllers: [BooksController],
    providers: [BooksService, BooksRepository],
    exports: [TypeOrmModule, BooksService, BooksRepository],
})
export class BooksModule {}
