import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMeetingNoteDto {
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
        description: '참석자 기록 ID',
        example: '3',
    })
    @IsNotEmpty({ message: '참석자 ID는 필수입니다.' })
    @IsString()
    attendeeId: string;

    @ApiProperty({
        description: '노트 내용',
        example: '오늘 회의 내용은...',
    })
    @IsOptional() // 빈 문자열 허용
    @IsString()
    note: string;
}
