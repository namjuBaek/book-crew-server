import {
    Body,
    Controller,
    Post,
    Get,
    Query,
    Param,
    UseGuards,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    ForbiddenException,
    ConflictException,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiBody,
    ApiQuery,
} from '@nestjs/swagger';
import { WorkspacesService } from '../service/workspaces.service';
import { CreateWorkspaceDto } from '../dto/create-workspace.dto';
import { CreateWorkspaceResponseDto } from '../dto/create-workspace-response.dto';
import { GetWorkspacesResponseDto } from '../dto/get-workspaces-response.dto';
import { SearchWorkspaceDto } from '../dto/search-workspace.dto';
import { SearchWorkspaceResponseDto } from '../dto/search-workspace-response.dto';
import { JoinWorkspaceDto } from '../dto/join-workspace.dto';
import { JoinWorkspaceResponseDto } from '../dto/join-workspace-response.dto';
import { GetWorkspaceDetailResponseDto } from '../dto/get-workspace-detail-response.dto';
import { JwtAuthGuard } from '../../users/guard/jwt-auth.guard';
import { CurrentUser } from '../../users/decorator/current-user.decorator';
import type { CurrentUserData } from '../../users/decorator/current-user.decorator';

@ApiTags('workspaces')
@Controller('workspaces')
export class WorkspacesController {
    constructor(private readonly workspacesService: WorkspacesService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: '워크스페이스 생성',
        description: '새로운 워크스페이스를 생성하고 생성자를 관리자로 등록합니다.',
    })
    @ApiBody({ type: CreateWorkspaceDto })
    @ApiResponse({
        status: 201,
        description: '워크스페이스 생성 성공',
        type: CreateWorkspaceResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
    })
    @ApiResponse({
        status: 500,
        description: '서버 오류',
    })
    async createWorkspace(
        @CurrentUser() user: CurrentUserData,
        @Body() createWorkspaceDto: CreateWorkspaceDto,
    ): Promise<CreateWorkspaceResponseDto> {
        try {
            return await this.workspacesService.create(user, createWorkspaceDto);
        } catch (error) {
            throw new InternalServerErrorException(
                '워크스페이스 생성 중 오류가 발생했습니다.',
            );
        }
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: '내 워크스페이스 목록 조회',
        description: '내가 참여하고 있는 워크스페이스 목록을 조회합니다.',
    })
    @ApiResponse({
        status: 200,
        description: '조회 성공',
        type: GetWorkspacesResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
    })
    @ApiResponse({
        status: 500,
        description: '서버 오류',
    })
    async getMyWorkspaces(
        @CurrentUser() user: CurrentUserData,
    ): Promise<GetWorkspacesResponseDto> {
        try {
            return await this.workspacesService.getMyWorkspaces(user.id);
        } catch (error) {
            throw new InternalServerErrorException(
                '워크스페이스 목록 조회 중 오류가 발생했습니다.',
            );
        }
    }

    @Get('search')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: '워크스페이스 검색',
        description: '워크스페이스 이름 또는 설명으로 검색합니다.',
    })
    @ApiQuery({
        name: 'search',
        required: true,
        description: '검색어',
        example: 'Book',
    })
    @ApiResponse({
        status: 200,
        description: '검색 성공',
        type: SearchWorkspaceResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
    })
    @ApiResponse({
        status: 500,
        description: '서버 오류',
    })
    async searchWorkspaces(
        @CurrentUser() user: CurrentUserData,
        @Query() searchWorkspaceDto: SearchWorkspaceDto,
    ): Promise<SearchWorkspaceResponseDto> {
        try {
            return await this.workspacesService.searchWorkspaces(
                user.id,
                searchWorkspaceDto,
            );
        } catch (error) {
            throw new InternalServerErrorException(
                '워크스페이스 검색 중 오류가 발생했습니다.',
            );
        }
    }

    @Post('join')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: '워크스페이스 참여',
        description: '참여 코드를 입력하여 워크스페이스에 가입합니다.',
    })
    @ApiBody({ type: JoinWorkspaceDto })
    @ApiResponse({
        status: 200,
        description: '참여 성공',
        type: JoinWorkspaceResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
    })
    @ApiResponse({
        status: 403,
        description: '참여 코드 불일치',
    })
    @ApiResponse({
        status: 404,
        description: '워크스페이스 없음',
    })
    @ApiResponse({
        status: 409,
        description: '이미 가입된 워크스페이스',
    })
    @ApiResponse({
        status: 500,
        description: '서버 오류',
    })
    async joinWorkspace(
        @CurrentUser() user: CurrentUserData,
        @Body() joinWorkspaceDto: JoinWorkspaceDto,
    ): Promise<JoinWorkspaceResponseDto> {
        try {
            return await this.workspacesService.joinWorkspace(user, joinWorkspaceDto);
        } catch (error) {
            if (
                error instanceof NotFoundException ||
                error instanceof ForbiddenException ||
                error instanceof ConflictException
            ) {
                throw error;
            }
            throw new InternalServerErrorException(
                '워크스페이스 참여 중 오류가 발생했습니다.',
            );
        }
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: '워크스페이스 상세 조회',
        description: '워크스페이스 정보를 조회합니다. 멤버만 접근 가능합니다.',
    })
    @ApiResponse({
        status: 200,
        description: '조회 성공',
        type: GetWorkspaceDetailResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
    })
    @ApiResponse({
        status: 403,
        description: '접근 권한 없음 (멤버 아님)',
    })
    @ApiResponse({
        status: 500,
        description: '서버 오류',
    })
    async getWorkspaceDetail(
        @CurrentUser() user: CurrentUserData,
        @Param('id') id: string,
    ): Promise<GetWorkspaceDetailResponseDto> {
        try {
            return await this.workspacesService.getWorkspaceDetail(user.id, id);
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw error;
            }
            throw new InternalServerErrorException(
                '워크스페이스 정보 조회 중 오류가 발생했습니다.',
            );
        }
    }
}
