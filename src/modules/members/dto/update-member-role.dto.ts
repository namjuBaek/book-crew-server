import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMemberRoleDto {
    @ApiProperty({
        description: '워크스페이스 ID',
        example: '1',
    })
    @IsNotEmpty({ message: '워크스페이스 ID는 필수입니다.' })
    @IsString()
    workspaceId: string;

    @ApiProperty({
        description: '대상 멤버 ID',
        example: '5',
    })
    @IsNotEmpty({ message: '멤버 ID는 필수입니다.' })
    @IsString()
    memberId: string;

    @ApiProperty({
        description: '변경할 권한 (ADMIN 또는 MEMBER)',
        example: 'ADMIN',
        enum: ['ADMIN', 'MEMBER'],
    })
    @IsNotEmpty({ message: '변경할 권한은 필수입니다.' })
    @IsEnum(['ADMIN', 'MEMBER'], { message: '권한은 ADMIN 또는 MEMBER여야 합니다.' })
    updateRole: 'ADMIN' | 'MEMBER';
}
