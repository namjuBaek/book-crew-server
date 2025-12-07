import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckUserIdDto {
    @ApiProperty({
        description: '중복 확인할 아이디',
        example: 'testuser123',
        minLength: 4,
        maxLength: 20,
    })
    @IsNotEmpty({ message: '아이디를 입력해주세요.' })
    @IsString({ message: '아이디는 문자열이어야 합니다.' })
    @MinLength(4, { message: '아이디는 최소 4자 이상이어야 합니다.' })
    @MaxLength(20, { message: '아이디는 최대 20자까지 가능합니다.' })
    userId: string;
}
