import {
    Body,
    Controller,
    Post,
    HttpCode,
    HttpStatus,
    UseGuards,
    InternalServerErrorException,
    ForbiddenException,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { BooksService } from '../service/books.service';
import { JwtAuthGuard } from '../../users/guard/jwt-auth.guard';
import { CurrentUser } from '../../users/decorator/current-user.decorator';
import type { CurrentUserData } from '../../users/decorator/current-user.decorator';
import { CreateBookDto } from '../dto/create-book.dto';
import { CreateBookResponseDto } from '../dto/create-book-response.dto';
import { GetBooksDto } from '../dto/get-books.dto';
import { GetBooksResponseDto } from '../dto/get-books-response.dto';

@ApiTags('Books')
@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: '책 목록 조회',
        description: '워크스페이스에 등록된 책 목록을 조회합니다.',
    })
    @ApiBody({ type: GetBooksDto })
    @ApiResponse({
        status: 200,
        description: '조회 성공',
        type: GetBooksResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
    })
    @ApiResponse({
        status: 403,
        description: '권한 없음 (멤버 아님)',
    })
    @ApiResponse({
        status: 500,
        description: '서버 오류',
    })
    async getBooks(
        @CurrentUser() user: CurrentUserData,
        @Body() getBooksDto: GetBooksDto,
    ): Promise<GetBooksResponseDto> {
        try {
            return await this.booksService.getBooks(user.id, getBooksDto);
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw error;
            }
            throw new InternalServerErrorException(
                '책 목록 조회 중 오류가 발생했습니다.',
            );
        }
    }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: '책 등록',
        description: '워크스페이스에 새로운 책을 등록합니다.',
    })
    @ApiBody({ type: CreateBookDto })
    @ApiResponse({
        status: 200,
        description: '등록 성공',
        type: CreateBookResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
    })
    @ApiResponse({
        status: 403,
        description: '권한 없음 (멤버 아님)',
    })
    @ApiResponse({
        status: 500,
        description: '서버 오류',
    })
    async createBook(
        @CurrentUser() user: CurrentUserData,
        @Body() createBookDto: CreateBookDto,
    ): Promise<CreateBookResponseDto> {
        try {
            return await this.booksService.createBook(user.id, createBookDto);
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw error;
            }
            throw new InternalServerErrorException(
                '책 등록 중 오류가 발생했습니다.',
            );
        }
    }
}
