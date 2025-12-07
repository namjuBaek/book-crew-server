import { ApiProperty } from '@nestjs/swagger';

class WorkspaceDetailData {
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
        description: '커버 이미지 URL',
        example: 'https://example.com/image.jpg',
        nullable: true,
    })
    coverImage?: string | null;

    @ApiProperty({
        description: '생성일',
        example: '2025-12-07T07:27:25.000Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: '내 역할',
        example: 'ADMIN',
    })
    role: string;
}

export class GetWorkspaceDetailResponseDto {
    @ApiProperty({
        description: '요청 성공 여부',
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: '워크스페이스 상세 정보',
        type: WorkspaceDetailData,
    })
    data: WorkspaceDetailData;

    @ApiProperty({
        description: '응답 메시지',
        example: '워크스페이스 정보를 조회했습니다.',
    })
    message: string;
}
