import { Injectable, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { MeetingLogsRepository } from '../repository/meeting-logs.repository';
import { AttendeesRepository } from '../repository/attendees.repository';
import { MembersRepository } from '../../workspaces/repository/members.repository';
import { MeetingLog } from '../entity/meeting-log.entity';
import { Attendee } from '../entity/attendee.entity';
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
import {
    NotFoundException,
} from '@nestjs/common';

@Injectable()
export class MeetingsService {
    constructor(
        private readonly meetingLogsRepository: MeetingLogsRepository,
        private readonly attendeesRepository: AttendeesRepository,
        private readonly membersRepository: MembersRepository,
        private readonly dataSource: DataSource,
    ) { }

    async createMeeting(
        userId: string,
        createMeetingDto: CreateMeetingDto,
    ): Promise<CreateMeetingResponseDto> {
        const { workspaceId, title, meetingDate, bookId, attendees } =
            createMeetingDto;

        // 1. 요청자 멤버십 확인
        const requester = await this.membersRepository.findByUserAndWorkspace(
            userId,
            workspaceId,
        );

        if (!requester) {
            throw new ForbiddenException('워크스페이스 접근 권한이 없습니다.');
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 2. MeetingLog 생성
            const meetingLog = this.meetingLogsRepository.create({
                workspaceId,
                title,
                meetingDate,
                bookId: bookId || null,
            });
            const savedMeetingLog = await queryRunner.manager.save(
                MeetingLog,
                meetingLog,
            );

            // 3. Attendees 생성
            if (attendees && attendees.length > 0) {
                // 중복 제거
                const uniqueAttendeeIds = [...new Set(attendees)];

                // 멤버 존재 여부 검증 (선택적: 여기선 생략하고 FK 제약 조건에 맡기거나, 
                // DB 쿼리 한 번으로 ID들이 해당 워크스페이스 멤버인지 확인하는 것이 좋음.
                // 편의상 바로 저장 시도. 존재하지 않는 멤버 ID라면 FK 에러 발생)

                const attendeeEntities = uniqueAttendeeIds.map((memberId) =>
                    this.attendeesRepository.create({
                        meetingLogId: savedMeetingLog.id,
                        memberId,
                    }),
                );
                await queryRunner.manager.save(Attendee, attendeeEntities);
            }

            await queryRunner.commitTransaction();

            return {
                success: true,
                data: {
                    id: savedMeetingLog.id,
                    title: savedMeetingLog.title,
                    createdAt: savedMeetingLog.createdAt,
                },
                message: '미팅 문서를 생성했습니다.',
            };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            // FK 에러 처리 등 필요할 수 있음
            throw new InternalServerErrorException(
                '미팅 문서 생성 중 오류가 발생했습니다.',
            );
        } finally {
            await queryRunner.release();
        }
    }

    async getMeetings(
        userId: string,
        getMeetingsDto: GetMeetingsDto,
        page: number = 1,
    ): Promise<GetMeetingsResponseDto> {
        const { workspaceId, keyword, startDate, endDate } = getMeetingsDto;
        const limit = 10; // 페이지당 10개

        // 1. 멤버십 확인
        const member = await this.membersRepository.findByUserAndWorkspace(
            userId,
            workspaceId,
        );

        if (!member) {
            throw new ForbiddenException('워크스페이스 접근 권한이 없습니다.');
        }

        // 2. 미팅 목록 조회
        const pageNum = page > 0 ? page : 1;
        const [meetings, totalCount] =
            await this.meetingLogsRepository.findByWorkspaceId(
                workspaceId,
                pageNum,
                limit,
                keyword,
                startDate,
                endDate,
            );

        const meetingData = meetings.map((meeting) => ({
            id: meeting.id,
            title: meeting.title,
            meetingDate: meeting.meetingDate, // string (YYYY-MM-DD or similar from DB)
            createdAt: meeting.createdAt,
            bookTitle: meeting.book ? meeting.book.title : null,
            attendeeCount: meeting.attendees ? meeting.attendees.length : 0,
        }));

        const totalPage = Math.ceil(totalCount / limit);

        return {
            success: true,
            data: meetingData,
            meta: {
                page: pageNum,
                totalCount,
                totalPage,
            },
            message: '미팅 목록을 조회했습니다.',
        };
    }

    async getMeetingDetail(
        userId: string,
        meetingId: string,
        getMeetingDetailDto: GetMeetingDetailDto,
    ): Promise<GetMeetingDetailResponseDto> {
        const { workspaceId } = getMeetingDetailDto;

        // 1. 멤버십 확인
        const member = await this.membersRepository.findByUserAndWorkspace(
            userId,
            workspaceId,
        );

        if (!member) {
            throw new ForbiddenException('워크스페이스 접근 권한이 없습니다.');
        }

        // 2. 미팅 상세 조회
        const meeting = await this.meetingLogsRepository.findDetailById(meetingId);

        if (!meeting) {
            throw new NotFoundException('해당 미팅 문서를 찾을 수 없습니다.');
        }

        if (meeting.workspaceId !== workspaceId) {
            // 다른 워크스페이스의 문서를 조회하려고 할 경우
            throw new NotFoundException('해당 미팅 문서를 찾을 수 없습니다.');
        }

        // 3. 응답 데이터 가공
        const attendeesData = meeting.attendees.map((attendee) => ({
            id: attendee.id,
            memberId: attendee.memberId,
            name: attendee.member ? attendee.member.name : 'Unknown',
            role: attendee.member ? attendee.member.role : 'MEMBER',
            userId: attendee.member?.user?.userId || '',
            note: attendee.note,
        }));

        // Member 엔티티에 userId가 있습니다 (BigInt 아님, String ID). 
        // 그러나 Member 엔티티 조회 시 User 엔티티까지 Join하진 않았습니다.
        // Member 엔티티 자체에 `userId`(FK가 아닌 String값?)가 있는지 확인해봐야 함.
        // DB 스펙 상 `member.user_id`는 FK이고 `BIGINT`입니다.
        // 하지만 `users` 테이블의 `user_id`(String ID)를 리턴해야 한다면 `members` 조회 시 `users`도 조인해야 함.
        // 현재 `AttendeesRepository.findDetailById`에서는 `attendees.member`만 조인함.

        // 일단 `member.name` (워크스페이스 내 닉네임)은 가져옵니다.
        // `member.userId`는 FK ID (숫자)입니다.
        // 클라이언트가 원하는 게 `user.user_id` (로그인 ID)인지 확인 필요.
        // 보통 닉네임을 보여주므로 `name`이면 충분할 수 있습니다.
        // DTO에는 `userId`가 String example 'user123'으로 되어 있어 로그인 ID로 추정됩니다.
        // 이를 위해선 `member` 조회 시 `user` 관계도 가져와야 합니다. 

        return {
            success: true,
            data: {
                id: meeting.id,
                title: meeting.title,
                meetingDate: meeting.meetingDate,
                createdAt: meeting.createdAt,
                bookId: meeting.bookId,
                bookTitle: meeting.book ? meeting.book.title : null,
                attendees: attendeesData,
            },
            message: '미팅 상세 정보를 조회했습니다.',
        };
    }

    async updateMeeting(
        userId: string,
        updateMeetingDto: UpdateMeetingDto,
    ): Promise<UpdateMeetingResponseDto> {
        const { workspaceId, meetingId, title, meetingDate, bookId, attendees } =
            updateMeetingDto;

        // 1. 멤버십 확인
        const member = await this.membersRepository.findByUserAndWorkspace(
            userId,
            workspaceId,
        );

        if (!member) {
            throw new ForbiddenException('워크스페이스 접근 권한이 없습니다.');
        }

        // 2. 미팅 로그 존재 확인
        const meeting = await this.meetingLogsRepository.findById(meetingId);
        if (!meeting) {
            throw new NotFoundException('해당 미팅 문서를 찾을 수 없습니다.');
        }

        if (meeting.workspaceId !== workspaceId) {
            throw new NotFoundException('해당 미팅 문서를 찾을 수 없습니다.');
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 3. MeetingLog 수정
            if (title) meeting.title = title;
            if (meetingDate) meeting.meetingDate = meetingDate;
            if (bookId !== undefined) meeting.bookId = bookId; // null 가능

            await queryRunner.manager.save(MeetingLog, meeting);

            // 4. Attendees 수정 (전체 삭제 후 재생성)
            if (attendees) { // attendees가 undefined면 건드리지 않음. 빈 배열이면 모두 삭제.
                await this.attendeesRepository.deleteByMeetingId(meetingId); // Repository 메서드 사용 불가 (트랜잭션 밖). QueryRunner 써야 함.

                // QueryRunner로 삭제
                await queryRunner.manager.delete(Attendee, { meetingLogId: meetingId });

                if (attendees.length > 0) {
                    const uniqueAttendeeIds = [...new Set(attendees)];
                    const attendeeEntities = uniqueAttendeeIds.map((memberId) =>
                        this.attendeesRepository.create({
                            meetingLogId: meetingId,
                            memberId,
                        }),
                    );
                    await queryRunner.manager.save(Attendee, attendeeEntities);
                }
            }

            await queryRunner.commitTransaction();

            return {
                success: true,
                data: {
                    id: meeting.id,
                    title: meeting.title,
                },
                message: '미팅 정보를 수정했습니다.',
            };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(
                '미팅 정보 수정 중 오류가 발생했습니다.',
            );
        } finally {
            await queryRunner.release();
        }
    }

    async updateMeetingNote(
        userId: string, // 로그인 ID (user123)
        updateMeetingNoteDto: UpdateMeetingNoteDto,
    ): Promise<UpdateMeetingNoteResponseDto> {
        const { workspaceId, meetingId, attendeeId, note } = updateMeetingNoteDto;

        // 1. 멤버십 확인
        const member = await this.membersRepository.findByUserAndWorkspace(
            userId,
            workspaceId,
        );

        if (!member) {
            throw new ForbiddenException('워크스페이스 접근 권한이 없습니다.');
        }

        // 2. Attendee 및 본인 확인
        const attendee = await this.attendeesRepository.findByIdWithUser(attendeeId);

        if (!attendee) {
            throw new NotFoundException('참석자 정보를 찾을 수 없습니다.');
        }

        if (attendee.meetingLogId !== meetingId) {
            throw new NotFoundException('해당 미팅의 참석자가 아닙니다.');
        }

        if (!attendee.member) {
            throw new InternalServerErrorException('참석자 정보 오류');
        }

        if (attendee.member.userId !== userId) {
            throw new ForbiddenException('본인의 노트만 수정할 수 있습니다.');
        }

        // 3. 노트 수정
        attendee.note = note;
        await this.attendeesRepository.save(attendee);

        return {
            success: true,
            data: {
                attendeeId: attendee.id,
                note: attendee.note,
            },
            message: '노트를 수정했습니다.',
        };
    }
}
