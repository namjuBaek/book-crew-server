import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';

@Injectable()
export class UsersRepository {
    constructor(
        @InjectRepository(User)
        private readonly repo: Repository<User>,
    ) {}

    create(payload: Partial<User>): User {
        return this.repo.create(payload);
    }

    save(user: User): Promise<User> {
        return this.repo.save(user);
    }

    findById(id: string): Promise<User | null> {
        return this.repo.findOne({ where: { id } });
    }

    findByUserId(userId: string): Promise<User | null> {
        return this.repo.findOne({ where: { userId } });
    }
}
