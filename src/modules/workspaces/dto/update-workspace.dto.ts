import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWorkspaceDto {
    @ApiProperty({
        description: '변경할 워크스페이스 이름',
        example: 'New Workspace Name',
        maxLength: 100,
    })
    @IsNotEmpty({ message: '워크스페이스 이름을 입력해주세요.' })
    @IsString({ message: '워크스페이스 이름은 문자열이어야 합니다.' })
    @MaxLength(100, { message: '워크스페이스 이름은 최대 100자까지 가능합니다.' })
    name: string;
}
