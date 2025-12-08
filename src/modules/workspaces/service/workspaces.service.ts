import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { WorkspacesRepository } from '../repository/workspaces.repository';
import { MembersRepository } from '../repository/members.repository';
import { Workspace } from '../entity/workspace.entity';
import { Member } from '../entity/member.entity';
import { CreateWorkspaceDto } from '../dto/create-workspace.dto';
import { CreateWorkspaceResponseDto } from '../dto/create-workspace-response.dto';
import { GetWorkspacesResponseDto } from '../dto/get-workspaces-response.dto';
import { SearchWorkspaceDto } from '../dto/search-workspace.dto';
import { SearchWorkspaceResponseDto } from '../dto/search-workspace-response.dto';
import { JoinWorkspaceDto } from '../dto/join-workspace.dto';
import { JoinWorkspaceResponseDto } from '../dto/join-workspace-response.dto';
import { GetWorkspaceDetailResponseDto } from '../dto/get-workspace-detail-response.dto';
import { UpdateWorkspaceDto } from '../dto/update-workspace.dto';
import { UpdateWorkspaceResponseDto } from '../dto/update-workspace-response.dto';
import { DeleteWorkspaceResponseDto } from '../dto/delete-workspace-response.dto';
import { LeaveWorkspaceResponseDto } from '../dto/leave-workspace-response.dto';
import { CanLeaveWorkspaceResponseDto } from '../dto/can-leave-workspace-response.dto';
import { CurrentUserData } from '../../users/decorator/current-user.decorator';
import {
    NotFoundException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class WorkspacesService {
    constructor(
        private readonly workspacesRepository: WorkspacesRepository,
        private readonly membersRepository: MembersRepository,
        private readonly dataSource: DataSource,
    ) { }

    async create(
        user: CurrentUserData,
        createWorkspaceDto: CreateWorkspaceDto,
    ): Promise<CreateWorkspaceResponseDto> {
        const { workspaceName, description } = createWorkspaceDto;
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. 워크스페이스 비밀번호 생성 (영문+숫자 6자리)
            const password = this.generateRandomPassword(6);

            // 2. 워크스페이스 생성
            const workspace = this.workspacesRepository.create({
                name: workspaceName,
                description: description,
                password: password,
            });
            const savedWorkspace = await queryRunner.manager.save(Workspace, workspace);

            // 3. 멤버 추가 (관리자 권한)
            const member = this.membersRepository.create({
                userId: user.id,
                workspaceId: savedWorkspace.id,
                name: user.userId, // 사용자 아이디를 멤버 이름으로 사용
                role: 'ADMIN',
            });
            await queryRunner.manager.save(Member, member);

            await queryRunner.commitTransaction();

            return {
                success: true,
                data: {
                    id: savedWorkspace.id,
                    name: savedWorkspace.name,
                    description: savedWorkspace.description,
                    password: password,
                },
                message: '워크스페이스가 생성되었습니다.',
            };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(
                '워크스페이스 생성 중 오류가 발생했습니다.',
            );
        } finally {
            await queryRunner.release();
        }
    }

    async getMyWorkspaces(userId: string): Promise<GetWorkspacesResponseDto> {
        const members = await this.membersRepository.findWorkspacesByUserId(userId);

        const workspaces = members.map((member) => ({
            id: member.workspace.id,
            name: member.workspace.name,
            description: member.workspace.description,
            coverImage: member.workspace.coverImage,
            createdAt: member.workspace.createdAt,
            role: member.role,
        }));

        return {
            success: true,
            data: workspaces,
            message: '워크스페이스 목록을 조회했습니다.',
        };
    }

    async searchWorkspaces(
        userId: string,
        searchWorkspaceDto: SearchWorkspaceDto,
    ): Promise<SearchWorkspaceResponseDto> {
        const { search } = searchWorkspaceDto;
        const workspaces = await this.workspacesRepository.search(search);

        // 사용자가 가입한 워크스페이스 목록 조회
        const myMemberships = await this.membersRepository.findWorkspacesByUserId(userId);
        const myWorkspaceIds = new Set(myMemberships.map((m) => m.workspaceId));

        const searchedWorkspaces = workspaces.map((workspace) => ({
            id: workspace.id,
            name: workspace.name,
            description: workspace.description,
            coverImage: workspace.coverImage,
            createdAt: workspace.createdAt,
            isJoined: myWorkspaceIds.has(workspace.id),
        }));

        return {
            success: true,
            data: searchedWorkspaces,
            message: '워크스페이스 검색 결과입니다.',
        };
    }

    async joinWorkspace(
        user: CurrentUserData,
        joinWorkspaceDto: JoinWorkspaceDto,
    ): Promise<JoinWorkspaceResponseDto> {
        const { workspaceId, workspacePassword } = joinWorkspaceDto;

        // 1. 워크스페이스 존재 확인
        const workspace = await this.workspacesRepository.findById(workspaceId);
        if (!workspace) {
            throw new NotFoundException('워크스페이스를 찾을 수 없습니다.');
        }

        // 2. 이미 가입된 멤버인지 확인
        const existingMember = await this.membersRepository.findByUserAndWorkspace(
            user.id,
            workspaceId,
        );
        if (existingMember) {
            throw new ConflictException('이미 가입된 워크스페이스입니다.');
        }

        // 3. 참여 코드 확인
        if (workspace.password !== workspacePassword) {
            throw new ForbiddenException('참여 코드가 일치하지 않습니다.');
        }

        // 4. 멤버 추가
        const member = this.membersRepository.create({
            userId: user.id,
            workspaceId: workspaceId,
            name: user.userId, // 사용자 아이디를 멤버 이름으로 사용
            role: 'MEMBER',
        });
        await this.membersRepository.save(member);

        return {
            success: true,
            data: {},
            message: '워크스페이스에 참여했습니다.',
        };
    }

    async getWorkspaceDetail(
        userId: string,
        workspaceId: string,
    ): Promise<GetWorkspaceDetailResponseDto> {
        // 멤버십 및 워크스페이스 정보 조회
        const member = await this.membersRepository.findMemberWithWorkspace(
            userId,
            workspaceId,
        );

        if (!member) {
            // 멤버가 아니거나 워크스페이스가 없는 경우
            // 보안을 위해 워크스페이스 존재 여부를 노출하지 않고 권한 없음으로 처리할 수도 있지만,
            // 여기서는 명확하게 구분하지 않고 Forbidden으로 처리 (요구사항: 403 Forbidden 권장)
            throw new ForbiddenException('워크스페이스에 접근할 권한이 없습니다.');
        }

        return {
            success: true,
            data: {
                id: member.workspace.id,
                name: member.workspace.name,
                description: member.workspace.description,
                coverImage: member.workspace.coverImage,
                createdAt: member.workspace.createdAt,
                role: member.role,
            },
            message: '워크스페이스 정보를 조회했습니다.',
        };
    }

    async updateWorkspace(
        userId: string,
        workspaceId: string,
        updateWorkspaceDto: UpdateWorkspaceDto,
    ): Promise<UpdateWorkspaceResponseDto> {
        const { name } = updateWorkspaceDto;

        // 1. 멤버십 및 권한 확인
        const member = await this.membersRepository.findByUserAndWorkspace(
            userId,
            workspaceId,
        );

        if (!member) {
            throw new ForbiddenException('워크스페이스에 접근할 권한이 없습니다.');
        }

        if (member.role !== 'ADMIN') {
            throw new ForbiddenException('워크스페이스 수정 권한이 없습니다.');
        }

        // 2. 워크스페이스 정보 수정
        const workspace = await this.workspacesRepository.findById(workspaceId);
        if (!workspace) {
            // 멤버는 있는데 워크스페이스가 없는 경우는 데이터 무결성 오류이지만, 처리해둠
            throw new NotFoundException('워크스페이스를 찾을 수 없습니다.');
        }

        workspace.name = name;
        await this.workspacesRepository.save(workspace);

        return {
            success: true,
            data: {
                id: workspace.id,
                name: workspace.name,
            },
            message: '워크스페이스 정보를 수정했습니다.',
        };
    }

    async deleteWorkspace(
        userId: string,
        workspaceId: string,
    ): Promise<DeleteWorkspaceResponseDto> {
        // 1. 멤버십 및 권한 확인
        const member = await this.membersRepository.findByUserAndWorkspace(
            userId,
            workspaceId,
        );

        if (!member) {
            throw new ForbiddenException('워크스페이스에 접근할 권한이 없습니다.');
        }

        if (member.role !== 'ADMIN') {
            throw new ForbiddenException('워크스페이스 삭제 권한이 없습니다.');
        }

        // 2. 워크스페이스 삭제
        // DB의 ON DELETE CASCADE 설정으로 인해 멤버, 책, 미팅 로그 등이 자동 삭제됨
        await this.workspacesRepository.delete(workspaceId);

        return {
            success: true,
            data: {},
            message: '워크스페이스를 삭제했습니다.',
        };
    }

    async leaveWorkspace(
        userId: string,
        workspaceId: string,
    ): Promise<LeaveWorkspaceResponseDto> {
        // 1. 멤버십 확인
        const member = await this.membersRepository.findByUserAndWorkspace(
            userId,
            workspaceId,
        );

        if (!member) {
            throw new ForbiddenException('워크스페이스에 참여하고 있지 않습니다.');
        }

        // 2. 관리자가 나가려는 경우 (선택 사항: 관리자 권한 이양 로직이 없다면 관리자만 남으면 삭제되거나 에러 처리 등이 필요할 수 있음)
        // 여기서는 별도 제약 없이 나가는 것으로 구현. 관리자가 나가면 해당 워크스페이스는 관리자가 없게 됨.
        // 필요 시: if (member.role === 'ADMIN') throw new BadRequestException('관리자는 워크스페이스를 나갈 수 없습니다. 먼저 관리자를 위임하거나 워크스페이스를 삭제하세요.');

        // 3. 멤버 삭제 (나가기)
        await this.membersRepository.delete(member.id);

        return {
            success: true,
            data: {},
            message: '워크스페이스에서 나갔습니다.',
        };
    }

    async checkIfCanLeaveWorkspace(
        userId: string,
        workspaceId: string,
    ): Promise<CanLeaveWorkspaceResponseDto> {
        const member = await this.membersRepository.findByUserAndWorkspace(
            userId,
            workspaceId,
        );

        if (!member) {
            throw new ForbiddenException('워크스페이스에 참여하고 있지 없습니다.');
        }

        let canLeave = true;

        // 관리자인 경우, 혼자인지 확인
        if (member.role === 'ADMIN') {
            const adminCount = await this.membersRepository.countAdmins(workspaceId);
            if (adminCount <= 1) {
                canLeave = false;
            }
        }

        return {
            success: true,
            data: { canLeave },
            message: '나가기 가능 여부를 확인했습니다.',
        };
    }

    private generateRandomPassword(length: number): string {
        const chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

    createWorkspace(data: Partial<Workspace>): Promise<Workspace> {
        const workspace = this.workspacesRepository.create(data);
        return this.workspacesRepository.save(workspace);
    }

    createMember(data: Partial<Member>): Promise<Member> {
        const member = this.membersRepository.create(data);
        return this.membersRepository.save(member);
    }
}
