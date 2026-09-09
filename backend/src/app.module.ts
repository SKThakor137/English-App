import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ContentModule } from './modules/content/content.module';
import { StorageModule } from './storage/storage.module';
import { PracticeModule } from './modules/practice/practice.module';
import { PronunciationModule } from './modules/pronunciation/pronunciation.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { VocabularyModule } from './modules/vocabulary/vocabulary.module';
import { ProgressModule } from './modules/progress/progress.module';
import { ChallengesModule } from './modules/challenges/challenges.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    DatabaseModule,
    StorageModule,
    HealthModule,
    AuthModule,
    UsersModule,
    ContentModule,
    PracticeModule,
    PronunciationModule,
    DocumentsModule,
    ConversationsModule,
    VocabularyModule,
    ProgressModule,
    ChallengesModule,
    SubscriptionsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
