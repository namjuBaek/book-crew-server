import { ApiProperty } from '@nestjs/swagger';

class CreatedWorkspaceData {
    @ApiProperty({
        description: '생성된 워크스페이스 ID',
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
        description: '워크스페이스 참여 코드 (비밀번호)',
        example: 'A1B2C3',
    })
    password: string;
}

export class CreateWorkspaceResponseDto {
    @ApiProperty({
        description: '요청 성공 여부',
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: '생성된 워크스페이스 정보',
        type: CreatedWorkspaceData,
    })
    data: CreatedWorkspaceData;

    @ApiProperty({
        description: '응답 메시지',
        example: '워크스페이스가 생성되었습니다.',
    })
    message: string;
}
