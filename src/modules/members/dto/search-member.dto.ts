import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchMemberDto {
    @ApiProperty({
        description: '워크스페이스 ID',
        example: '1',
    })
    @IsNotEmpty({ message: '워크스페이스 ID는 필수입니다.' })
    @IsString()
    workspaceId: string;

    @ApiProperty({
        description: '검색 키워드 (이름)',
        example: '홍길동',
        required: false,
    })
    @IsOptional()
    @IsString()
    keyword?: string;
}
