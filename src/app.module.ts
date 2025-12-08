import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BooksModule } from './modules/books/books.module';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { MembersModule } from './modules/members/members.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infra/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';

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
        MembersModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
