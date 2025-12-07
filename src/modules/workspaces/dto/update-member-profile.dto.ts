import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMemberProfileDto {
    @ApiProperty({
        description: '변경할 멤버 이름',
        example: 'New Name',
        maxLength: 255,
    })
    @IsNotEmpty({ message: '이름을 입력해주세요.' })
    @IsString({ message: '이름은 문자열이어야 합니다.' })
    @MaxLength(255, { message: '이름은 최대 255자까지 가능합니다.' })
    name: string;
}
