import { ApiProperty } from '@nestjs/swagger';

class UpdatedRoleData {
    @ApiProperty({
        description: '멤버 ID',
        example: '5',
    })
    id: string;

    @ApiProperty({
        description: '변경된 권한',
        example: 'ADMIN',
    })
    role: string;
}

export class UpdateMemberRoleResponseDto {
    @ApiProperty({
        description: '요청 성공 여부',
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: '데이터',
        type: UpdatedRoleData,
    })
    data: UpdatedRoleData;

    @ApiProperty({
        description: '응답 메시지',
        example: '멤버 권한을 수정했습니다.',
    })
    message: string;
}
