import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { MembersRepository } from '../../workspaces/repository/members.repository';
import { KickMemberDto } from '../dto/kick-member.dto';
import { KickMemberResponseDto } from '../dto/kick-member-response.dto';
import { GetMembersDto } from '../dto/get-members.dto';
import { GetMembersResponseDto } from '../dto/get-members-response.dto';
import { GetMemberProfileDto } from '../dto/get-member-profile.dto';
import { GetMemberProfileResponseDto } from '../dto/get-member-profile-response.dto';
import { UpdateMemberDto } from '../dto/update-member.dto';
import { UpdateMemberResponseDto } from '../dto/update-member-response.dto';
import { UpdateMemberRoleDto } from '../dto/update-member-role.dto';
import { UpdateMemberRoleResponseDto } from '../dto/update-member-role-response.dto';
import { SearchMemberDto } from '../dto/search-member.dto';
import { SearchMemberResponseDto } from '../dto/search-member-response.dto';

@Injectable()
export class MembersService {
    constructor(private readonly membersRepository: MembersRepository) { }

    async kickMember(
        userId: string,
        kickMemberDto: KickMemberDto,
    ): Promise<KickMemberResponseDto> {
        const { workspaceId, memberId } = kickMemberDto;

        // 1. 요청자의 권한 확인 (관리자 여부)
        const requester = await this.membersRepository.findByUserAndWorkspace(
            userId,
            workspaceId,
        );

        if (!requester) {
            throw new ForbiddenException('워크스페이스 접근 권한이 없습니다.');
        }

        if (requester.role !== 'ADMIN') {
            throw new ForbiddenException('멤버 추방 권한이 없습니다.');
        }

        // 2. 대상 멤버 확인
        // 멤버 ID로 멤버를 찾고, 그 멤버가 해당 워크스페이스 소속인지 확인해야 함
        // MembersRepository에 findById 추가가 필요할 수 있음. 
        // 일단 Delete 하기 전에 유효성을 검증하기 위해 findMemberWithWorkspace 등을 쓰기엔 id 기반이 아님.
        // MembersRepository에 findById 메서드가 없으므로 repo.findOne을 쓰거나 메서드를 추가해야 함.
        // 여기서는 MembersRepository가 TypeORM Repository를 래핑하고 있으므로, 굳이 Repository 파일 수정 없이
        // MembersModule에서 MembersRepository를 주입받는데,
        // MembersRepository에 id로 조회하는 메서드를 추가하는 것이 좋겠음.

        // 일단 MembersService에서는 MembersRepository의 기능을 활용.
        // MembersRepository에 findByIdAndWorkspaceId 추가를 요청하거나,
        // 그냥 delete를 시도하고 affected를 확인할 수도 있지만,
        // "해당 멤버가 워크스페이스에 존재하지 않음"과 "삭제 성공"을 구분하기 위해 조회가 나음.

        // MembersRepository에 findById 메서드 추가를 가정하고 작성하거나,
        // 지금 바로 추가해야 함.

        // 일단 작성하고 Repository 수정 단계로.
        const targetMember = await this.membersRepository.findById(memberId);

        if (!targetMember) {
            throw new NotFoundException('해당 멤버를 찾을 수 없습니다.');
        }

        if (String(targetMember.workspaceId) !== String(workspaceId)) {
            throw new ForbiddenException('해당 멤버는 이 워크스페이스 소속이 아닙니다.');
        }

        // 3. 자기 자신 추방 방지 (선택)
        if (String(targetMember.userId) === String(userId)) {
            throw new ForbiddenException('자기 자신을 내보낼 수 없습니다. 나가기 기능을 이용하세요.');
        }

        // 4. 추방 (삭제)
        await this.membersRepository.delete(memberId);

        return {
            success: true,
            data: {},
            message: '멤버를 내보냈습니다.',
        };
    }

    async getMembers(
        userId: string,
        getMembersDto: GetMembersDto,
    ): Promise<GetMembersResponseDto> {
        const { workspaceId, page, keyword } = getMembersDto;
        const pageNum = page || 1;

        // 1. 멤버십 확인 (현재 요청자가 멤버인지)
        const member = await this.membersRepository.findByUserAndWorkspace(
            userId,
            workspaceId,
        );

        if (!member) {
            throw new ForbiddenException('워크스페이스 접근 권한이 없습니다.');
        }

        // 2. 멤버 목록 조회
        const limit = 20;
        const [members, totalCount] = await this.membersRepository.findByWorkspaceId(
            workspaceId,
            pageNum,
            limit,
            keyword,
        );

        const memberData = members.map((m) => ({
            id: m.id,
            name: m.name,
            role: m.role,
            userId: m.userId,
        }));

        const totalPage = Math.ceil(totalCount / limit);

        return {
            success: true,
            data: memberData,
            meta: {
                totalCount,
                totalPage,
                currentPage: pageNum,
            },
            message: '멤버 목록을 조회했습니다.',
        };
    }

    async searchMembers(
        userId: string,
        searchMemberDto: SearchMemberDto,
    ): Promise<SearchMemberResponseDto> {
        const { workspaceId, keyword } = searchMemberDto;

        // 1. 멤버십 확인
        const member = await this.membersRepository.findByUserAndWorkspace(
            userId,
            workspaceId,
        );

        if (!member) {
            throw new ForbiddenException('워크스페이스 접근 권한이 없습니다.');
        }

        // 2. 검색 (최대 50명)
        const limit = 50;
        const [members] = await this.membersRepository.findByWorkspaceId(
            workspaceId,
            1, // 첫 페이지
            limit,
            keyword,
        );

        const memberData = members.map((m) => ({
            id: m.id,
            name: m.name,
            role: m.role,
            userId: m.userId,
        }));

        return {
            success: true,
            data: memberData,
            message: '멤버를 검색했습니다.',
        };
    }

    async getMemberProfile(
        userId: string,
        getMemberProfileDto: GetMemberProfileDto,
    ): Promise<GetMemberProfileResponseDto> {
        const { workspaceId } = getMemberProfileDto;

        const member = await this.membersRepository.findByUserAndWorkspace(
            userId,
            workspaceId,
        );

        if (!member) {
            throw new ForbiddenException('워크스페이스 접근 권한이 없습니다.');
        }

        return {
            success: true,
            data: {
                id: member.id,
                name: member.name,
                role: member.role,
                userId: member.userId,
                workspaceId: member.workspaceId,
            },
            message: '멤버 정보를 조회했습니다.',
        };
    }

    async updateMemberProfile(
        userId: string,
        updateMemberDto: UpdateMemberDto,
    ): Promise<UpdateMemberResponseDto> {
        const { workspaceId, name } = updateMemberDto;

        const member = await this.membersRepository.findByUserAndWorkspace(
            userId,
            workspaceId,
        );

        if (!member) {
            throw new ForbiddenException('워크스페이스 접근 권한이 없습니다.');
        }

        member.name = name;
        await this.membersRepository.save(member);

        return {
            success: true,
            data: {
                id: member.id,
                name: member.name,
            },
            message: '멤버 프로필을 수정했습니다.',
        };
    }

    async updateMemberRole(
        userId: string,
        updateMemberRoleDto: UpdateMemberRoleDto,
    ): Promise<UpdateMemberRoleResponseDto> {
        const { workspaceId, memberId, updateRole } = updateMemberRoleDto;

        // 1. 요청자 권한 확인 (관리자 여부)
        const requester = await this.membersRepository.findByUserAndWorkspace(
            userId,
            workspaceId,
        );

        if (!requester || requester.role !== 'ADMIN') {
            throw new ForbiddenException('멤버 권한 수정 권한이 없습니다.');
        }

        // 2. 대상 멤버 확인
        const targetMember = await this.membersRepository.findById(memberId);

        if (!targetMember) {
            throw new NotFoundException('해당 멤버를 찾을 수 없습니다.');
        }

        if (String(targetMember.workspaceId) !== String(workspaceId)) {
            throw new ForbiddenException('해당 멤버는 이 워크스페이스 소속이 아닙니다.');
        }

        // 3. 권한 수정
        targetMember.role = updateRole;
        await this.membersRepository.save(targetMember);

        return {
            success: true,
            data: {
                id: targetMember.id,
                role: targetMember.role,
            },
            message: '멤버 권한을 수정했습니다.',
        };
    }
}
