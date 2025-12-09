import { ApiProperty } from '@nestjs/swagger';

class SearchedWorkspaceData {
    @ApiProperty({
        description: '워크스페이스 ID',
        example: '1',
    })
    id: string;

    @ApiProperty({
        description: '워크스페이스 이름',
        example: 'My Book Club',
    })
    name: string;

    @ApiProperty({
        description: '워크스페이스 설명',
        example: '독서 모임입니다.',
        nullable: true,
    })
    description?: string | null;

    @ApiProperty({
        description: '생성 일시',
        example: '2023-10-01T12:00:00Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: '가입 여부',
        example: true,
    })
    isJoined: boolean;
}

export class SearchWorkspaceResponseDto {
    @ApiProperty({
        description: '요청 성공 여부',
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: '검색된 워크스페이스 목록',
        type: [SearchedWorkspaceData],
    })
    data: SearchedWorkspaceData[];

    @ApiProperty({
        description: '응답 메시지',
        example: '워크스페이스 검색 결과입니다.',
    })
    message: string;
}
