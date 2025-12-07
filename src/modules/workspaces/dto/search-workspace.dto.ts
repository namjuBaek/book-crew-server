import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchWorkspaceDto {
    @ApiProperty({
        description: '검색어',
        example: 'Book',
        minLength: 1,
    })
    @IsNotEmpty({ message: '검색어를 입력해주세요.' })
    @IsString({ message: '검색어는 문자열이어야 합니다.' })
    @MinLength(1, { message: '검색어는 최소 1자 이상이어야 합니다.' })
    search: string;
}
