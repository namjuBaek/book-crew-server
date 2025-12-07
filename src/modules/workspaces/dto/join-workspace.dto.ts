import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JoinWorkspaceDto {
    @ApiProperty({
        description: '워크스페이스 ID',
        example: '1',
    })
    @IsNotEmpty({ message: '워크스페이스 ID를 입력해주세요.' })
    @IsString({ message: '워크스페이스 ID는 문자열이어야 합니다.' })
    workspaceId: string;

    @ApiProperty({
        description: '워크스페이스 참여 코드 (비밀번호)',
        example: 'A1B2C3',
    })
    @IsNotEmpty({ message: '참여 코드를 입력해주세요.' })
    @IsString({ message: '참여 코드는 문자열이어야 합니다.' })
    workspacePassword: string;
}
