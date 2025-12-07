import { ApiProperty } from '@nestjs/swagger';

class UpdatedWorkspaceData {
    @ApiProperty({
        description: '워크스페이스 ID',
        example: '1',
    })
    id: string;

    @ApiProperty({
        description: '변경된 워크스페이스 이름',
        example: 'New Workspace Name',
    })
    name: string;
}

export class UpdateWorkspaceResponseDto {
    @ApiProperty({
        description: '요청 성공 여부',
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: '변경된 워크스페이스 정보',
        type: UpdatedWorkspaceData,
    })
    data: UpdatedWorkspaceData;

    @ApiProperty({
        description: '응답 메시지',
        example: '워크스페이스 정보를 수정했습니다.',
    })
    message: string;
}
