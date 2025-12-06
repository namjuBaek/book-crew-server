import { ConflictException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../repository/users.repository';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';
import { SignupDto } from '../dto/signup.dto';
import { SignupResponseDto } from '../dto/signup-response.dto';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) { }

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
