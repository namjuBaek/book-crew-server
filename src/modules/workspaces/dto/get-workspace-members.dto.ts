import { IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetWorkspaceMembersDto {
    @ApiProperty({
        description: '페이지 번호 (기본값: 1)',
        example: 1,
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;
}
