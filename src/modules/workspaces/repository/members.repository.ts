import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../entity/member.entity';

@Injectable()
export class MembersRepository {
    constructor(
        @InjectRepository(Member)
        private readonly repo: Repository<Member>,
    ) { }

    create(payload: Partial<Member>): Member {
        return this.repo.create(payload);
    }

    save(member: Member): Promise<Member> {
        return this.repo.save(member);
    }

    findByUserAndWorkspace(userId: string, workspaceId: string): Promise<Member | null> {
        return this.repo.findOne({ where: { userId, workspaceId } });
    }

    findWorkspacesByUserId(userId: string): Promise<Member[]> {
        return this.repo.find({
            where: { userId },
            relations: ['workspace'],
            order: { createdAt: 'DESC' },
        });
    }

    findMemberWithWorkspace(userId: string, workspaceId: string): Promise<Member | null> {
        return this.repo.findOne({
            where: { userId, workspaceId },
            relations: ['workspace'],
        });
    }
}
