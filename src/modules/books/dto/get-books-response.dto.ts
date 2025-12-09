import { ApiProperty } from '@nestjs/swagger';

class BookData {
    @ApiProperty({
        description: '책 ID',
        example: '1',
    })
    id: string;

    @ApiProperty({
        description: '책 제목',
        example: '데이터 중심 애플리케이션 설계',
    })
    title: string;

    @ApiProperty({
        description: '생성 일시',
        example: '2023-10-01T12:00:00Z',
    })
    createdAt: Date;
}

export class GetBooksResponseDto {
    @ApiProperty({
        description: '요청 성공 여부',
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: '책 목록 데이터',
        type: [BookData],
    })
    data: BookData[];

    @ApiProperty({
        description: '응답 메시지',
        example: '책 목록을 조회했습니다.',
    })
    message: string;
}
