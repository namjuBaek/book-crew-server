import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infra/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { BooksModule } from './modules/books/books.module';
import { MeetingsModule } from './modules/meetings/meetings.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        DatabaseModule,
        UsersModule,
        WorkspacesModule,
        BooksModule,
        MeetingsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
