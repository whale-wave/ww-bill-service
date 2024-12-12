import * as path from 'node:path';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserInitMiddleware } from './middleware/UserInitMiddleware';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { CompatibleModule } from './modules/compatible/compatible.module';
import { FollowModule } from './modules/follow/follow.module';
import { SystemNotifyModule } from './modules/system-notify/system-notify.module';
import { ToolsModule } from './modules/tools/tools.module';
import { TopicModule } from './modules/topic/topic.module';
import { UserModule } from './modules/user/user.module';
import { RecordModule } from './modules/record/record.module';
import { CheckInModule } from './modules/check-in/check-in.module';
import { ChartModule } from './modules/chart/chart.module';
import { UserEmailModule } from './modules/user-email/user-email.module';
import { UserAppConfigModule } from './modules/user-app-config/user-app-config.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { BudgetModule } from './modules/budget/budget.module';
import { AssetModule } from './modules/asset/asset.module';
import { TaskModule } from './modules/task/task.module';
import { SocketModule } from './modules/socket/socket.module';

@Module({
  imports: [
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserInitMiddleware).forRoutes('*');
  }
}
