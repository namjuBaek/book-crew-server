import { Injectable } from '@nestjs/common';
import { WorkspacesRepository } from '../repository/workspaces.repository';
import { MembersRepository } from '../repository/members.repository';
import { Workspace } from '../entity/workspace.entity';
import { Member } from '../entity/member.entity';

@Injectable()
export class WorkspacesService {
    constructor(
        private readonly workspacesRepository: WorkspacesRepository,
        private readonly membersRepository: MembersRepository,
    ) {}

    createWorkspace(data: Partial<Workspace>): Promise<Workspace> {
        const workspace = this.workspacesRepository.create(data);
        return this.workspacesRepository.save(workspace);
    }

    createMember(data: Partial<Member>): Promise<Member> {
        const member = this.membersRepository.create(data);
        return this.membersRepository.save(member);
    }
}
