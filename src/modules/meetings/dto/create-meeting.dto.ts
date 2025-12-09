import { IsArray, IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMeetingDto {
    @ApiProperty({
        description: '워크스페이스 ID',
        example: '1',
    })
    @IsNotEmpty({ message: '워크스페이스 ID는 필수입니다.' })
    @IsString()
    workspaceId: string;

    @ApiProperty({
        description: '모임 제목',
        example: '1회차 정기 모임',
    })
    @IsNotEmpty({ message: '모임 제목은 필수입니다.' })
    @IsString()
    title: string;

    @ApiProperty({
        description: '진행 일자',
        example: '2023-10-01',
    })
    @IsNotEmpty({ message: '진행 일자는 필수입니다.' })
    @IsDateString()
    meetingDate: string;

    @ApiProperty({
        description: '책 ID (선택)',
        example: '1',
        required: false,
    })
    @IsOptional()
    @IsString()
    bookId?: string;

    @ApiProperty({
        description: '참석자 ID 목록 (Member ID)',
        example: ['1', '2'],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    attendees?: string[];
}
