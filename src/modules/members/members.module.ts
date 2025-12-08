import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../workspaces/entity/member.entity';
import { MembersController } from './controller/members.controller';
import { MembersService } from './service/members.service';
import { MembersRepository } from '../workspaces/repository/members.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Member])],
    controllers: [MembersController],
    providers: [MembersService, MembersRepository],
    exports: [MembersService],
})
export class MembersModule { }
