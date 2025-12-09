
import {
    Controller,
    Post,
    Patch,
    Put,
    Body,
    Query,
    UseGuards,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiBody,
    ApiQuery,
} from '@nestjs/swagger';
import { MeetingsService } from '../service/meetings.service';
import { CreateMeetingDto } from '../dto/create-meeting.dto';
import { CreateMeetingResponseDto } from '../dto/create-meeting-response.dto';
import { GetMeetingsDto } from '../dto/get-meetings.dto';
import { GetMeetingsResponseDto } from '../dto/get-meetings-response.dto';
import { GetMeetingDetailDto } from '../dto/get-meeting-detail.dto';
import { GetMeetingDetailResponseDto } from '../dto/get-meeting-detail-response.dto';
import { UpdateMeetingDto } from '../dto/update-meeting.dto';
import { UpdateMeetingResponseDto } from '../dto/update-meeting-response.dto';
import { UpdateMeetingNoteDto } from '../dto/update-meeting-note.dto';
import { UpdateMeetingNoteResponseDto } from '../dto/update-meeting-note-response.dto';
import { JwtAuthGuard } from '../../users/guard/jwt-auth.guard';
import { CurrentUser } from '../../users/decorator/current-user.decorator';
import type { CurrentUserData } from '../../users/decorator/current-user.decorator';

@ApiTags('Meetings')
@Controller('meetings')
export class MeetingsController {
    constructor(private readonly meetingsService: MeetingsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: '미팅 목록 조회',
        description: '워크스페이스의 미팅 목록을 조회합니다. (페이지네이션 지원)',
    })
    @ApiBody({ type: GetMeetingsDto })
    @ApiQuery({
        name: 'page',
        required: false,
        description: '페이지 번호 (기본값: 1)',
        type: Number,
    })
    @ApiResponse({
        status: 200,
        description: '조회 성공',
        type: GetMeetingsResponseDto,
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
    async getMeetings(
        @CurrentUser() user: CurrentUserData,
        @Body() getMeetingsDto: GetMeetingsDto,
        @Query('page') page?: number,
    ): Promise<GetMeetingsResponseDto> {
        try {
            return await this.meetingsService.getMeetings(
                user.id,
                getMeetingsDto,
                page,
            );
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw error;
            }
            throw new InternalServerErrorException(
                '미팅 목록 조회 중 오류가 발생했습니다.',
            );
        }
    }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: '미팅 문서 생성',
        description: '워크스페이스에 새로운 미팅 문서를 생성하고 참석자를 등록합니다.',
    })
    @ApiBody({ type: CreateMeetingDto })
    @ApiResponse({
        status: 200,
        description: '생성 성공',
        type: CreateMeetingResponseDto,
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
    async createMeeting(
        @CurrentUser() user: CurrentUserData,
        @Body() createMeetingDto: CreateMeetingDto,
    ): Promise<CreateMeetingResponseDto> {
        try {
            return await this.meetingsService.createMeeting(
                user.id,
                createMeetingDto,
            );
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw error;
            }
            throw new InternalServerErrorException(
                '미팅 문서 생성 중 오류가 발생했습니다.',
            );
        }
    }

    @Post('detail')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: '미팅 상세 조회',
        description: '미팅 문서의 상세 정보를 조회합니다. (제목, 날짜, 책, 참석자 및 노트 등)',
    })
    @ApiBody({ type: GetMeetingDetailDto })
    @ApiQuery({
        name: 'id',
        required: true,
        description: '미팅 로그 ID',
        type: String,
    })
    @ApiResponse({
        status: 200,
        description: '조회 성공',
        type: GetMeetingDetailResponseDto,
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
        status: 404,
        description: '미팅 문서 없음',
    })
    @ApiResponse({
        status: 500,
        description: '서버 오류',
    })
    async getMeetingDetail(
        @CurrentUser() user: CurrentUserData,
        @Body() getMeetingDetailDto: GetMeetingDetailDto,
        @Query('id') id: string,
    ): Promise<GetMeetingDetailResponseDto> {
        try {
            return await this.meetingsService.getMeetingDetail(
                user.id,
                id,
                getMeetingDetailDto,
            );
        } catch (error) {
            if (
                error instanceof ForbiddenException ||
                error instanceof NotFoundException // NotFoundException import 필요! Service에서 던짐.
            ) {
                throw error;
            }
            throw new InternalServerErrorException(
                '미팅 상세 조회 중 오류가 발생했습니다.',
            );
        }
    }
    @Patch('detail')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: '미팅 정보 수정',
        description: '미팅 문서의 정보(제목, 날짜, 책, 참석자)를 수정합니다.',
    })
    @ApiBody({ type: UpdateMeetingDto })
    @ApiResponse({
        status: 200,
        description: '수정 성공',
        type: UpdateMeetingResponseDto,
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
        status: 404,
        description: '미팅 문서 없음',
    })
    @ApiResponse({
        status: 500,
        description: '서버 오류',
    })
    async updateMeeting(
        @CurrentUser() user: CurrentUserData,
        @Body() updateMeetingDto: UpdateMeetingDto,
    ): Promise<UpdateMeetingResponseDto> {
        try {
            return await this.meetingsService.updateMeeting(
                user.id,
                updateMeetingDto,
            );
        } catch (error) {
            if (
                error instanceof ForbiddenException ||
                error instanceof NotFoundException
            ) {
                throw error;
            }
            throw new InternalServerErrorException(
                '미팅 정보 수정 중 오류가 발생했습니다.',
            );
        }
    }

    @Put('detail/note')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: '참석자 노트 수정',
        description: '본인의 참석자 노트 내용을 수정합니다.',
    })
    @ApiBody({ type: UpdateMeetingNoteDto })
    @ApiResponse({
        status: 200,
        description: '수정 성공',
        type: UpdateMeetingNoteResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
    })
    @ApiResponse({
        status: 403,
        description: '권한 없음 (본인이 아님)',
    })
    @ApiResponse({
        status: 404,
        description: '참석자 정보 없음',
    })
    @ApiResponse({
        status: 500,
        description: '서버 오류',
    })
    async updateMeetingNote(
        @CurrentUser() user: CurrentUserData,
        @Body() updateMeetingNoteDto: UpdateMeetingNoteDto,
    ): Promise<UpdateMeetingNoteResponseDto> {
        try {
            return await this.meetingsService.updateMeetingNote(
                user.id,
                updateMeetingNoteDto,
            );
        } catch (error) {
            if (
                error instanceof ForbiddenException ||
                error instanceof NotFoundException
            ) {
                throw error;
            }
            throw new InternalServerErrorException(
                '참석자 노트 수정 중 오류가 발생했습니다.',
            );
        }
    }
}
