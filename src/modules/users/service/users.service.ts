import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repository/users.repository';
import { User } from '../entity/user.entity';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

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
