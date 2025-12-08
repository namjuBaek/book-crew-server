import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
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

    delete(id: string): Promise<void> {
        return this.repo.delete(id).then(() => undefined);
    }

    findByWorkspaceId(
        workspaceId: string,
        page: number = 1,
        limit: number = 20,
        keyword?: string,
    ): Promise<[Member[], number]> {
        const where: any = { workspaceId };
        if (keyword) {
            where.name = Like(`%${keyword}%`);
        }

        return this.repo.findAndCount({
            where,
            skip: (page - 1) * limit,
            take: limit,
            order: { name: 'ASC' },
        });
    }

    countAdmins(workspaceId: string): Promise<number> {
        return this.repo.count({
            where: { workspaceId, role: 'ADMIN' },
        });
    }

    findById(id: string): Promise<Member | null> {
        return this.repo.findOne({ where: { id } });
    }
}
