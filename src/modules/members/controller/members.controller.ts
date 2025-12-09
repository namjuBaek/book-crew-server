import {
    Body,
    Controller,
    Delete,
    Post,
    Patch,
    HttpCode,
    HttpStatus,
    UseGuards,
    InternalServerErrorException,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../users/guard/jwt-auth.guard';
import { CurrentUser } from '../../users/decorator/current-user.decorator';
import type { CurrentUserData } from '../../users/decorator/current-user.decorator';
import { MembersService } from '../service/members.service';
import { KickMemberDto } from '../dto/kick-member.dto';
import { KickMemberResponseDto } from '../dto/kick-member-response.dto';
import { GetMembersDto } from '../dto/get-members.dto';
import { GetMembersResponseDto } from '../dto/get-members-response.dto';
import { SearchMemberDto } from '../dto/search-member.dto';
import { SearchMemberResponseDto } from '../dto/search-member-response.dto';
import { GetMemberProfileDto } from '../dto/get-member-profile.dto';
import { GetMemberProfileResponseDto } from '../dto/get-member-profile-response.dto';
import { UpdateMemberDto } from '../dto/update-member.dto';
import { UpdateMemberResponseDto } from '../dto/update-member-response.dto';
import { UpdateMemberRoleDto } from '../dto/update-member-role.dto';
import { UpdateMemberRoleResponseDto } from '../dto/update-member-role-response.dto';

@ApiTags('Members')
@Controller('members')
export class MembersController {
    constructor(private readonly membersService: MembersService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: '멤버 목록 조회',
        description: '워크스페이스의 멤버 목록을 조회합니다. (Body로 workspaceId 전달)',
    })
    @ApiBody({ type: GetMembersDto })
    @ApiResponse({
        status: 200,
        description: '조회 성공',
        type: GetMembersResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
    })
    @ApiResponse({
        status: 403,
        description: '권한 없음 (멤버 아님)',
    })
    @ApiResponse({
        status: 500,
        description: '서버 오류',
    })
    async getMembers(
        @CurrentUser() user: CurrentUserData,
        @Body() getMembersDto: GetMembersDto,
    ): Promise<GetMembersResponseDto> {
        try {
            return await this.membersService.getMembers(user.id, getMembersDto);
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw error;
            }
            throw new InternalServerErrorException(
                '멤버 목록 조회 중 오류가 발생했습니다.',
            );
        }
    }

    @Post('search')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: '멤버 검색 (참석자 설정용)',
        description: '워크스페이스 멤버를 검색합니다. (최대 50명, 페이지네이션 없음)',
    })
    @ApiBody({ type: SearchMemberDto })
    @ApiResponse({
        status: 200,
        description: '검색 성공',
        type: SearchMemberResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
    })
    @ApiResponse({
        status: 403,
        description: '권한 없음 (멤버 아님)',
    })
    @ApiResponse({
        status: 500,
        description: '서버 오류',
    })
    async searchMembers(
        @CurrentUser() user: CurrentUserData,
        @Body() searchMemberDto: SearchMemberDto,
    ): Promise<SearchMemberResponseDto> {
        try {
            return await this.membersService.searchMembers(
                user.id,
                searchMemberDto,
            );
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw error;
            }
            throw new InternalServerErrorException(
                '멤버 검색 중 오류가 발생했습니다.',
            );
        }
    }

    @Post('me')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: '내 멤버 정보 조회',
        description:
            '특정 워크스페이스 내 나의 멤버 정보를 조회합니다. (Body로 workspaceId 전달)',
    })
    @ApiBody({ type: GetMemberProfileDto })
    @ApiResponse({
        status: 200,
        description: '조회 성공',
        type: GetMemberProfileResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
    })
    @ApiResponse({
        status: 403,
        description: '권한 없음 (멤버 아님)',
    })
    @ApiResponse({
        status: 500,
        description: '서버 오류',
    })
    async getMemberProfile(
        @CurrentUser() user: CurrentUserData,
        @Body() getMemberProfileDto: GetMemberProfileDto,
    ): Promise<GetMemberProfileResponseDto> {
        try {
            return await this.membersService.getMemberProfile(
                user.id,
                getMemberProfileDto,
            );
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw error;
            }
            throw new InternalServerErrorException(
                '멤버 정보 조회 중 오류가 발생했습니다.',
            );
        }
    }

    @Patch('me')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: '내 멤버 정보(닉네임) 수정',
        description: '특정 워크스페이스 내 나의 멤버 정보를 수정합니다.',
    })
    @ApiBody({ type: UpdateMemberDto })
    @ApiResponse({
        status: 200,
        description: '수정 성공',
        type: UpdateMemberResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
    })
    @ApiResponse({
        status: 403,
        description: '권한 없음 (멤버 아님)',
    })
    @ApiResponse({
        status: 500,
        description: '서버 오류',
    })
    async updateMemberProfile(
        @CurrentUser() user: CurrentUserData,
        @Body() updateMemberDto: UpdateMemberDto,
    ): Promise<UpdateMemberResponseDto> {
        try {
            return await this.membersService.updateMemberProfile(
                user.id,
                updateMemberDto,
            );
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw error;
            }
            throw new InternalServerErrorException(
                '멤버 정보 수정 중 오류가 발생했습니다.',
            );
        }
    }

    @Patch('role')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: '멤버 권한 설정',
        description: '워크스페이스 멤버의 권한(ADMIN/MEMBER)을 수정합니다.',
    })
    @ApiBody({ type: UpdateMemberRoleDto })
    @ApiResponse({
        status: 200,
        description: '수정 성공',
        type: UpdateMemberRoleResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
    })
    @ApiResponse({
        status: 403,
        description: '권한 없음 (관리자 아님)',
    })
    @ApiResponse({
        status: 500,
        description: '서버 오류',
    })
    async updateMemberRole(
        @CurrentUser() user: CurrentUserData,
        @Body() updateMemberRoleDto: UpdateMemberRoleDto,
    ): Promise<UpdateMemberRoleResponseDto> {
        try {
            return await this.membersService.updateMemberRole(
                user.id,
                updateMemberRoleDto,
            );
        } catch (error) {
            if (
                error instanceof ForbiddenException ||
                error instanceof NotFoundException
            ) {
                throw error;
            }
            throw new InternalServerErrorException(
                '멤버 권한 수정 중 오류가 발생했습니다.',
            );
        }
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: '멤버 내보내기 (추방)',
        description: '워크스페이스 관리자가 특정 멤버를 내보냅니다.',
    })
    @ApiBody({ type: KickMemberDto })
    @ApiResponse({
        status: 200,
        description: '추방 성공',
        type: KickMemberResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
    })
    @ApiResponse({
        status: 403,
        description: '권한 없음 (관리자 아님 또는 대상이 다른 워크스페이스)',
    })
    @ApiResponse({
        status: 404,
        description: '멤버 없음',
    })
    @ApiResponse({
        status: 500,
        description: '서버 오류',
    })
    async kickMember(
        @CurrentUser() user: CurrentUserData,
        @Body() kickMemberDto: KickMemberDto,
    ): Promise<KickMemberResponseDto> {
        try {
            return await this.membersService.kickMember(user.id, kickMemberDto);
        } catch (error) {
            if (
                error instanceof ForbiddenException ||
                error instanceof NotFoundException
            ) {
                throw error;
            }
            throw new InternalServerErrorException(
                '멤버 추방 중 오류가 발생했습니다.',
            );
        }
    }
}
