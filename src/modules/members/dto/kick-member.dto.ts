import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class KickMemberDto {
    @ApiProperty({
        description: '워크스페이스 ID',
        example: '1',
    })
    @IsNotEmpty({ message: '워크스페이스 ID는 필수입니다.' })
    @IsString()
    workspaceId: string;

    @ApiProperty({
        description: '내보낼 멤버 ID',
        example: '5',
    })
    @IsNotEmpty({ message: '내보낼 멤버 ID는 필수입니다.' })
    @IsString()
    memberId: string;
}
