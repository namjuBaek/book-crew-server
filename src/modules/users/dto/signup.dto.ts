import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
    @ApiProperty({
        description: '사용자 아이디',
        example: 'testuser123',
        minLength: 4,
    })
    @IsNotEmpty({ message: '아이디를 입력해주세요.' })
    @IsString()
    @MinLength(4, { message: '아이디는 최소 4자 이상이어야 합니다.' })
    userId: string;

    @ApiProperty({
        description: '비밀번호 (영문, 숫자 포함 8자 이상)',
        example: 'password123',
        minLength: 8,
    })
    @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
    @IsString()
    @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
    @Matches(/^(?=.*[a-zA-Z])(?=.*\d)/, {
        message: '비밀번호는 영문과 숫자를 포함해야 합니다.',
    })
    password: string;
}
