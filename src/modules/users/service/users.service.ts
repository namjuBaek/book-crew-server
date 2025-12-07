import {
    ConflictException,
    Injectable,
    UnauthorizedException,
    NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../repository/users.repository';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';
import { SignupDto } from '../dto/signup.dto';
import { SignupResponseDto } from '../dto/signup-response.dto';
import { CheckUserIdDto } from '../dto/check-userid.dto';
import { CheckUserIdResponseDto } from '../dto/check-userid-response.dto';
import { LoginDto } from '../dto/login.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { UserMeResponseDto } from '../dto/user-me-response.dto';
import { LogoutResponseDto } from '../dto/logout-response.dto';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly jwtService: JwtService,
    ) { }

    async signup(signupDto: SignupDto): Promise<SignupResponseDto> {
        const { userId, password } = signupDto;

        // 중복 사용자 확인
        const existingUser = await this.usersRepository.findByUserId(userId);
        if (existingUser) {
            throw new ConflictException('이미 사용 중인 아이디입니다.');
        }

        // 비밀번호 해싱
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 사용자 생성
        const user = await this.create({
            userId,
            password: hashedPassword,
        });

        return {
            success: true,
            message: '회원가입이 완료되었습니다.',
            userId: user.userId,
        };
    }

    async checkUserIdAvailability(
        checkUserIdDto: CheckUserIdDto,
    ): Promise<CheckUserIdResponseDto> {
        const { userId } = checkUserIdDto;

        // 아이디 중복 확인
        const existingUser = await this.usersRepository.findByUserId(userId);

        if (existingUser) {
            return {
                success: true,
                data: {
                    available: false,
                    userId: userId,
                },
                message: '이미 사용 중인 아이디입니다.',
            };
        }

        return {
            success: true,
            data: {
                available: true,
                userId: userId,
            },
            message: '사용 가능한 아이디입니다.',
        };
    }

    async login(loginDto: LoginDto): Promise<LoginResponseDto> {
        const { userId, password, isAutoLogin } = loginDto;

        // 사용자 조회
        const user = await this.usersRepository.findByUserId(userId);
        if (!user) {
            console.log(`Login failed: User not found with userId ${userId}`);
            throw new UnauthorizedException(
                '아이디 또는 비밀번호가 일치하지 않습니다.',
            );
        }

        // 비밀번호 검증
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log(`Login failed: Invalid password for userId ${userId}`);
            throw new UnauthorizedException(
                '아이디 또는 비밀번호가 일치하지 않습니다.',
            );
        }

        // JWT 페이로드 생성
        const payload = {
            sub: user.id,
            userId: user.userId,
        };

        // 액세스 토큰 생성 (1시간)
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '1h',
        });

        // 응답 데이터 구성
        const responseData: LoginResponseDto = {
            success: true,
            data: {
                userId: user.userId,
                accessToken,
            },
            message: '로그인에 성공했습니다.',
        };

        // 자동 로그인 체크 시 리프레시 토큰 생성 (30일)
        if (isAutoLogin) {
            const refreshToken = this.jwtService.sign(payload, {
                expiresIn: '30d',
            });
            responseData.data.refreshToken = refreshToken;
        }

        return responseData;
    }

    async getCurrentUser(userId: string): Promise<UserMeResponseDto> {
        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        return {
            success: true,
            data: {
                userId: user.userId,
                createdAt: user.createdAt,
            },
            message: '사용자 정보를 조회했습니다.',
        };
    }

    async logout(): Promise<LogoutResponseDto> {
        // 로그아웃은 쿠키 삭제로 처리되므로 성공 메시지만 반환
        return {
            success: true,
            message: '로그아웃되었습니다.',
        };
    }

    create(data: Partial<User>): Promise<User> {
        const user = this.usersRepository.create(data);
        return this.usersRepository.save(user);
    }

    findById(id: string): Promise<User | null> {
        return this.usersRepository.findById(id);
    }

    findByUserId(userId: string): Promise<User | null> {
        return this.usersRepository.findByUserId(userId);
    }
}
