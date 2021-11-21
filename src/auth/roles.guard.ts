import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/user/user.service';
import { ROLES_KEY } from './roles.decorator';
import { UserType } from './userType.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector
      .getAllAndOverride<UserType[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ])
    const email = context.switchToHttp().getRequest().user;
    const user = await this.userService.find(email);
    if (!requiredRoles) {
      return true;
    } else if (user.userType !== String(requiredRoles)) {
      return false;
    } else {
      return true;
    }
  }
}
