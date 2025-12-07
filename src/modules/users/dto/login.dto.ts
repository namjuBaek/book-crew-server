import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        description: '사용자 아이디',
        example: 'testuser123',
    })
    @IsNotEmpty({ message: '아이디를 입력해주세요.' })
    @IsString({ message: '아이디는 문자열이어야 합니다.' })
    userId: string;

    @ApiProperty({
        description: '비밀번호',
        example: 'password123',
    })
    @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
    @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
    password: string;

    @ApiProperty({
        description: '자동 로그인 여부',
        example: false,
        required: false,
        default: false,
    })
    @IsOptional()
    @IsBoolean({ message: '자동 로그인 여부는 boolean 타입이어야 합니다.' })
    isAutoLogin?: boolean;
}
