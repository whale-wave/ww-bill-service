import { Module } from '@nestjs/common';
import config from '../../config';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ToolsModule } from '../tools/tools.module';

@Module({
  controllers: [AuthController],
  imports: [
    JwtModule.register({
      secret: config.secret,
      signOptions: { expiresIn: '12h' },
    }),
    PassportModule,
    UserModule,
    ToolsModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
