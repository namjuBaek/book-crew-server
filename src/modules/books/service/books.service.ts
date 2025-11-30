import { Injectable } from '@nestjs/common';
import { BooksRepository } from '../repository/books.repository';
import { Book } from '../entity/book.entity';

@Injectable()
export class BooksService {
    constructor(private readonly booksRepository: BooksRepository) {}

    create(data: Partial<Book>): Promise<Book> {
        const book = this.booksRepository.create(data);
        return this.booksRepository.save(book);
    }

    findById(id: string): Promise<Book | null> {
        return this.booksRepository.findById(id);
    }
}
