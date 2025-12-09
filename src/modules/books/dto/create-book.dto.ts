import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
    @ApiProperty({
        description: '워크스페이스 ID',
        example: '1',
    })
    @IsNotEmpty({ message: '워크스페이스 ID는 필수입니다.' })
    @IsString()
    workspaceId: string;

    @ApiProperty({
        description: '책 제목',
        example: '데이터 중심 애플리케이션 설계',
    })
    @IsNotEmpty({ message: '책 제목은 필수입니다.' })
    @IsString()
    @MaxLength(255)
    title: string;
}
