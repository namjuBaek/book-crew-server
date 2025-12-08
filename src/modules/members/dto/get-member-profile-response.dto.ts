import { ApiProperty } from '@nestjs/swagger';

class MemberProfileData {
    @ApiProperty({
        description: '멤버 ID',
        example: '1',
    })
    id: string;

    @ApiProperty({
        description: '멤버 이름 (워크스페이스 내 닉네임)',
        example: 'My Nickname',
    })
    name: string;

    @ApiProperty({
        description: '역할',
        example: 'MEMBER',
    })
    role: string;

    @ApiProperty({
        description: '사용자 ID',
        example: '10',
    })
    userId: string;

    @ApiProperty({
        description: '워크스페이스 ID',
        example: '1',
    })
    workspaceId: string;
}

export class GetMemberProfileResponseDto {
    @ApiProperty({
        description: '요청 성공 여부',
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: '멤버 데이터',
        type: MemberProfileData,
    })
    data: MemberProfileData;

    @ApiProperty({
        description: '응답 메시지',
        example: '멤버 정보를 조회했습니다.',
    })
    message: string;
}
