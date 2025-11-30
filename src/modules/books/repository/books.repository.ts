import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../entity/book.entity';

@Injectable()
export class BooksRepository {
    constructor(
        @InjectRepository(Book)
        private readonly repo: Repository<Book>,
    ) {}

    create(payload: Partial<Book>): Book {
        return this.repo.create(payload);
    }

    save(book: Book): Promise<Book> {
        return this.repo.save(book);
    }

    findById(id: string): Promise<Book | null> {
        return this.repo.findOne({ where: { id } });
    }
}
