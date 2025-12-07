import { ApiProperty } from '@nestjs/swagger';

class UpdatedMemberData {
    @ApiProperty({
        description: '멤버 ID',
        example: '1',
    })
    id: string;

    @ApiProperty({
        description: '변경된 이름',
        example: 'New Name',
    })
    name: string;
}

export class UpdateMemberProfileResponseDto {
    @ApiProperty({
        description: '요청 성공 여부',
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: '변경된 멤버 정보',
        type: UpdatedMemberData,
    })
    data: UpdatedMemberData;

    @ApiProperty({
        description: '응답 메시지',
        example: '멤버 프로필을 수정했습니다.',
    })
    message: string;
}
