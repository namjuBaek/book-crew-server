import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Workspace } from '../entity/workspace.entity';

@Injectable()
export class WorkspacesRepository {
    constructor(
        @InjectRepository(Workspace)
        private readonly repo: Repository<Workspace>,
    ) { }

    create(payload: Partial<Workspace>): Workspace {
        return this.repo.create(payload);
    }

    save(workspace: Workspace): Promise<Workspace> {
        return this.repo.save(workspace);
    }

    findById(id: string): Promise<Workspace | null> {
        return this.repo.findOne({ where: { id } });
    }

    search(keyword: string): Promise<Workspace[]> {
        return this.repo.find({
            where: [
                { name: Like(`%${keyword}%`) },
                { description: Like(`%${keyword}%`) },
            ],
            order: { createdAt: 'DESC' },
        });
    }

    delete(id: string): Promise<void> {
        return this.repo.delete(id).then(() => undefined);
    }
}
