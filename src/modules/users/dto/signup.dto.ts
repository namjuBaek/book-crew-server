import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class SignupDto {
    @IsNotEmpty({ message: '아이디를 입력해주세요.' })
    @IsString()
    @MinLength(4, { message: '아이디는 최소 4자 이상이어야 합니다.' })
    userId: string;

    @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
    @IsString()
    @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
    @Matches(/^(?=.*[a-zA-Z])(?=.*\d)/, {
        message: '비밀번호는 영문과 숫자를 포함해야 합니다.',
    })
    password: string;
}
