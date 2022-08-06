import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './chat.entity';
// import { DatabaseModule } from './database/database.module';
import { ChatService } from './chat/chat.service';

 
@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'sqlite',
			database: 'chat',
			entities: [Chat],
			synchronize: true,
		}),
		TypeOrmModule.forFeature([Chat]),
		// DatabaseModule,
	],
	controllers: [AppController],
	providers: [AppService, ChatService],
})
export class AppModule {}
