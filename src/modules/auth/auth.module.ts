import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import config from '../../config';
import { UserModule } from '../user/user.module';
import { ToolsModule } from '../tools/tools.module';
import { UserAppConfigModule } from '../user-app-config/user-app-config.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  controllers: [AuthController],
  imports: [
    JwtModule.register({
      secret: config.secret,
      signOptions: { expiresIn: config.token.expiresIn },
    }),
    PassportModule,
    UserModule,
    ToolsModule,
    UserAppConfigModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
