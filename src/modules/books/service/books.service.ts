import { ForbiddenException, Injectable } from '@nestjs/common';
import { BooksRepository } from '../repository/books.repository';
import { MembersRepository } from '../../workspaces/repository/members.repository';
import { CreateBookDto } from '../dto/create-book.dto';
import { CreateBookResponseDto } from '../dto/create-book-response.dto';
import { GetBooksDto } from '../dto/get-books.dto';
import { GetBooksResponseDto } from '../dto/get-books-response.dto';
import { Book } from '../entity/book.entity';

@Injectable()
export class BooksService {
    constructor(
        private readonly booksRepository: BooksRepository,
        private readonly membersRepository: MembersRepository,
    ) { }

    async createBook(
        userId: string,
        createBookDto: CreateBookDto,
    ): Promise<CreateBookResponseDto> {
        const { workspaceId, title } = createBookDto;

        // 1. 멤버십 확인 (책 등록 권한 = 일반 멤버 이상)
        const member = await this.membersRepository.findByUserAndWorkspace(
            userId,
            workspaceId,
        );

        if (!member) {
            throw new ForbiddenException('워크스페이스 멤버만 책을 등록할 수 있습니다.');
        }

        // 2. 책 생성
        const newBook = this.booksRepository.create({
            workspaceId,
            title,
            createdById: member.id, // 멤버 ID 저장
        });

        const savedBook = await this.booksRepository.save(newBook);

        return {
            success: true,
            data: {
                id: savedBook.id,
                title: savedBook.title,
                createdAt: savedBook.createdAt,
            },
            message: '책을 등록했습니다.',
        };
    }

    async getBooks(
        userId: string,
        getBooksDto: GetBooksDto,
    ): Promise<GetBooksResponseDto> {
        const { workspaceId, limit } = getBooksDto;

        // 1. 멤버십 확인
        const member = await this.membersRepository.findByUserAndWorkspace(
            userId,
            workspaceId,
        );

        if (!member) {
            throw new ForbiddenException('워크스페이스 접근 권한이 없습니다.');
        }

        // 2. 책 목록 조회
        const books = await this.booksRepository.findByWorkspaceId(workspaceId, limit);

        const bookData = books.map((book) => ({
            id: book.id,
            title: book.title,
            createdAt: book.createdAt,
        }));

        return {
            success: true,
            data: bookData,
            message: '책 목록을 조회했습니다.',
        };
    }

    // 기존 메서드 유지용 (필요하다면)
    findById(id: string): Promise<Book | null> {
        return this.booksRepository.findById(id);
    }
}
