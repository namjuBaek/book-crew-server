import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspacesController } from './controller/workspaces.controller';
import { WorkspacesService } from './service/workspaces.service';
import { WorkspacesRepository } from './repository/workspaces.repository';
import { MembersRepository } from './repository/members.repository';
import { Workspace } from './entity/workspace.entity';
import { Member } from './entity/member.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Workspace, Member])],
    controllers: [WorkspacesController],
    providers: [WorkspacesService, WorkspacesRepository, MembersRepository],
    exports: [TypeOrmModule, WorkspacesService, WorkspacesRepository, MembersRepository],
})
export class WorkspacesModule {}
