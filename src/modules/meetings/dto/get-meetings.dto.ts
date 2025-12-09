import { IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetMeetingsDto {
    @ApiProperty({
        description: '워크스페이스 ID',
        example: '1',
    })
    @IsNotEmpty({ message: '워크스페이스 ID는 필수입니다.' })
    @IsString()
    workspaceId: string;

    @ApiProperty({
        description: '검색 키워드 (문서 제목)',
        example: '정기 모임',
        required: false,
    })
    @IsOptional()
    @IsString()
    keyword?: string;

    @ApiProperty({
        description: '검색 시작 날짜 (YYYY-MM-DD)',
        example: '2023-10-01',
        required: false,
    })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiProperty({
        description: '검색 종료 날짜 (YYYY-MM-DD)',
        example: '2023-10-31',
        required: false,
    })
    @IsOptional()
    @IsDateString()
    endDate?: string;
}
