import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from '../entity/workspace.entity';

@Injectable()
export class WorkspacesRepository {
    constructor(
        @InjectRepository(Workspace)
        private readonly repo: Repository<Workspace>,
    ) {}

    create(payload: Partial<Workspace>): Workspace {
        return this.repo.create(payload);
    }

    save(workspace: Workspace): Promise<Workspace> {
        return this.repo.save(workspace);
    }

    findById(id: string): Promise<Workspace | null> {
        return this.repo.findOne({ where: { id } });
    }
}
