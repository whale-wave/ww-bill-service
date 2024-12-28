import * as path from 'node:path';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserInitMiddleware } from './middleware/UserInitMiddleware';
import { AssetModule } from './modules/asset/asset.module';
import { AuthModule } from './modules/auth/auth.module';
import { BudgetModule } from './modules/budget/budget.module';
import { CategoryModule } from './modules/category/category.module';
import { ChartModule } from './modules/chart/chart.module';
import { CheckInModule } from './modules/check-in/check-in.module';
import { CompatibleModule } from './modules/compatible/compatible.module';
import { FollowModule } from './modules/follow/follow.module';
import { HealthModule } from './modules/health/health.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { RecordModule } from './modules/record/record.module';
import { SocketModule } from './modules/socket/socket.module';
import { SystemNotifyModule } from './modules/system-notify/system-notify.module';
import { TaskModule } from './modules/task/task.module';
import { ToolsModule } from './modules/tools/tools.module';
import { TopicModule } from './modules/topic/topic.module';
import { UserAppConfigModule } from './modules/user-app-config/user-app-config.module';
import { UserEmailModule } from './modules/user-email/user-email.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 1000,
        limit: 30,
      },
      {
        ttl: 60000,
        limit: 500,
      },
    ]),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
        }),
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '../public'),
    }),
    AuthModule,
    UserModule,
    RecordModule,
    CategoryModule,
    TopicModule,
    CheckInModule,
    FollowModule,
    ToolsModule,
    SystemNotifyModule,
    CompatibleModule,
    ChartModule,
    UserEmailModule,
    UserAppConfigModule,
    InvoiceModule,
    BudgetModule,
    AssetModule,
    TaskModule,
    SocketModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserInitMiddleware).forRoutes('*');
  }
}
