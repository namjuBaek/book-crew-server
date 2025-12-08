import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMemberDto {
    @ApiProperty({
        description: '워크스페이스 ID',
        example: '1',
    })
    @IsNotEmpty({ message: '워크스페이스 ID는 필수입니다.' })
    @IsString()
    workspaceId: string;

    @ApiProperty({
        description: '변경할 멤버 이름',
        example: 'New Nickname',
        maxLength: 50,
    })
    @IsNotEmpty({ message: '이름은 필수 입력값입니다.' })
    @IsString()
    @MaxLength(50, { message: '이름은 50자 이내여야 합니다.' })
    name: string;
}
