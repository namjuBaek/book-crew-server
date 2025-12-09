import { IsArray, IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMeetingDto {
    @ApiProperty({
        description: '워크스페이스 ID',
        example: '1',
    })
    @IsNotEmpty({ message: '워크스페이스 ID는 필수입니다.' })
    @IsString()
    workspaceId: string;

    @ApiProperty({
        description: '미팅 로그 ID',
        example: '1',
    })
    @IsNotEmpty({ message: '미팅 로그 ID는 필수입니다.' })
    @IsString()
    meetingId: string;

    @ApiProperty({
        description: '모임 제목',
        example: '1회차 정기 모임',
        required: false,
    })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({
        description: '진행 일자',
        example: '2023-10-01',
        required: false,
    })
    @IsOptional()
    @IsDateString()
    meetingDate?: string;

    @ApiProperty({
        description: '책 ID (NULL 허용)',
        example: '1',
        required: false,
    })
    @IsOptional()
    @IsString()
    bookId?: string | null;

    @ApiProperty({
        description: '참석자 ID 목록 (Member ID). 비어있으면 기존 참석자 유지 또는 전체 삭제(정책 결정 필요). 여기선 전체 덮어쓰기로 구현.',
        example: ['1', '2'],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    attendees?: string[];
}
