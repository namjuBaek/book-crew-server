import {
    Body,
    Controller,
    Post,
    HttpCode,
    HttpStatus,
    ConflictException,
    InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { SignupDto } from '../dto/signup.dto';
import { SignupResponseDto } from '../dto/signup-response.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    async signup(@Body() signupDto: SignupDto): Promise<SignupResponseDto> {
        try {
            return await this.usersService.signup(signupDto);
        } catch (error) {
            // 에러 타입에 따라 적절한 응답 반환
            if (error instanceof ConflictException) {
                throw error;
            }

            // 예상치 못한 에러
            throw new InternalServerErrorException(
                '회원가입 처리 중 오류가 발생했습니다.',
            );
        }
    }
}
