import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkspaceDto {
    @ApiProperty({
        description: '워크스페이스 이름',
        example: 'My Book Club',
        maxLength: 255,
    })
    @IsNotEmpty({ message: '워크스페이스 이름을 입력해주세요.' })
    @IsString({ message: '워크스페이스 이름은 문자열이어야 합니다.' })
    @MaxLength(255, { message: '워크스페이스 이름은 최대 255자까지 가능합니다.' })
    workspaceName: string;

    @ApiProperty({
        description: '워크스페이스 설명',
        example: '독서 모임입니다.',
        required: false,
    })
    @IsOptional()
    @IsString({ message: '워크스페이스 설명은 문자열이어야 합니다.' })
    description?: string;
}
