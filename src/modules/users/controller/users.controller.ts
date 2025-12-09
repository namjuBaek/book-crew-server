import {
    Body,
    Controller,
    Post,
    Get,
    HttpCode,
    HttpStatus,
    ConflictException,
    InternalServerErrorException,
    UnauthorizedException,
    NotFoundException,
    Res,
    UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from '../service/users.service';
import { SignupDto } from '../dto/signup.dto';
import { SignupResponseDto } from '../dto/signup-response.dto';
import { CheckUserIdDto } from '../dto/check-userid.dto';
import { CheckUserIdResponseDto } from '../dto/check-userid-response.dto';
import { LoginDto } from '../dto/login.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { UserMeResponseDto } from '../dto/user-me-response.dto';
import { LogoutResponseDto } from '../dto/logout-response.dto';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { CurrentUser } from '../decorator/current-user.decorator';
import type { CurrentUserData } from '../decorator/current-user.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: '회원가입',
        description: '새로운 사용자를 등록합니다.',
    })
    @ApiBody({ type: SignupDto })
    @ApiResponse({
        status: 201,
        description: '회원가입 성공',
        type: SignupResponseDto,
    })
    @ApiResponse({
        status: 409,
        description: '이미 사용 중인 아이디',
    })
    @ApiResponse({
        status: 500,
        description: '서버 오류',
    })
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

    @Post('check-userid')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: '아이디 중복 체크',
        description: '회원가입 전 아이디 사용 가능 여부를 확인합니다.',
    })
    @ApiBody({ type: CheckUserIdDto })
    @ApiResponse({
        status: 200,
        description: '아이디 중복 확인 성공',
        type: CheckUserIdResponseDto,
        schema: {
            example: {
                success: true,
                data: {
                    available: true,
                    userId: 'testuser123',
                },
                message: '사용 가능한 아이디입니다.',
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: '잘못된 요청 (유효성 검증 실패)',
    })
    @ApiResponse({
        status: 500,
        description: '서버 오류',
    })
    async checkUserId(
        @Body() checkUserIdDto: CheckUserIdDto,
    ): Promise<CheckUserIdResponseDto> {
        try {
            return await this.usersService.checkUserIdAvailability(
                checkUserIdDto,
            );
        } catch (error) {
            // 예상치 못한 에러
            throw new InternalServerErrorException(
                '아이디 중복 확인 중 오류가 발생했습니다.',
            );
        }
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: '로그인',
        description: 'JWT 기반 로그인을 수행합니다. 자동 로그인 체크 시 리프레시 토큰이 발급됩니다.',
    })
    @ApiBody({ type: LoginDto })
    @ApiResponse({
        status: 200,
        description: '로그인 성공',
        type: LoginResponseDto,
        schema: {
            example: {
                success: true,
                data: {
                    userId: 'testuser123',
                    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
                message: '로그인에 성공했습니다.',
            },
        },
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패 (아이디 또는 비밀번호 불일치)',
    })
    @ApiResponse({
        status: 500,
        description: '서버 오류',
    })
    async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<LoginResponseDto> {
        try {
            const result = await this.usersService.login(loginDto);

            // 액세스 토큰을 HTTP-only 쿠키에 저장 (1시간)
            res.cookie('accessToken', result.data.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // HTTPS에서만 전송
                sameSite: 'lax', // Strict -> Lax로 완화
                maxAge: 60 * 60 * 1000, // 1시간
            });

            // 자동 로그인 체크 시 리프레시 토큰도 쿠키에 저장 (30일)
            if (result.data.refreshToken) {
                res.cookie('refreshToken', result.data.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax', // Strict -> Lax로 완화
                    maxAge: 30 * 24 * 60 * 60 * 1000, // 30일
                });
            }

            return result;
        } catch (error) {
            // 에러 타입에 따라 적절한 응답 반환
            if (error instanceof UnauthorizedException) {
                throw error;
            }

            // 예상치 못한 에러
            throw new InternalServerErrorException(
                '로그인 처리 중 오류가 발생했습니다.',
            );
        }
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: '현재 로그인한 사용자 정보 조회',
        description: 'JWT 토큰을 통해 현재 로그인한 사용자의 정보를 반환합니다. 쿠키 또는 Authorization 헤더에 토큰이 필요합니다.',
    })
    @ApiResponse({
        status: 200,
        description: '사용자 정보 조회 성공',
        type: UserMeResponseDto,
        schema: {
            example: {
                success: true,
                data: {
                    userId: 'testuser123',
                    createdAt: '2025-12-07T06:40:51.000Z',
                },
                message: '사용자 정보를 조회했습니다.',
            },
        },
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패 (토큰 없음 또는 만료)',
    })
    @ApiResponse({
        status: 404,
        description: '사용자를 찾을 수 없음',
    })
    @ApiResponse({
        status: 500,
        description: '서버 오류',
    })
    async getMe(@CurrentUser() user: CurrentUserData): Promise<UserMeResponseDto> {
        try {
            return await this.usersService.getCurrentUser(user.id);
        } catch (error) {
            // 에러 타입에 따라 적절한 응답 반환
            if (error instanceof NotFoundException) {
                throw error;
            }

            // 예상치 못한 에러
            throw new InternalServerErrorException(
                '사용자 정보 조회 중 오류가 발생했습니다.',
            );
        }
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: '로그아웃',
        description: '로그아웃을 수행합니다. 쿠키에 저장된 액세스 토큰과 리프레시 토큰을 모두 삭제하여 자동 로그인도 해제됩니다.',
    })
    @ApiResponse({
        status: 200,
        description: '로그아웃 성공',
        type: LogoutResponseDto,
        schema: {
            example: {
                success: true,
                message: '로그아웃되었습니다.',
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: '서버 오류',
    })
    async logout(@Res({ passthrough: true }) res: Response): Promise<LogoutResponseDto> {
        try {
            // accessToken 쿠키 삭제
            res.clearCookie('accessToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
            });

            // refreshToken 쿠키 삭제 (자동 로그인 해제)
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
            });

            return await this.usersService.logout();
        } catch (error) {
            // 예상치 못한 에러
            throw new InternalServerErrorException(
                '로그아웃 처리 중 오류가 발생했습니다.',
            );
        }
    }
}
