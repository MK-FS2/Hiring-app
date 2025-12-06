import { HR, HRRepository } from '@Models/Users';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission_KEY } from '@Shared/constants';
import { HRPermissions } from '@Shared/Enums';

@Injectable()
export class HRPermissionGuard implements CanActivate 
{
  constructor(private readonly hrRepository: HRRepository,private readonly reflector:Reflector) {}

   canActivate(context: ExecutionContext):boolean 
   {
    const req = context.switchToHttp().getRequest();
    const requiredPermissions:HRPermissions[]=this.reflector.get(Permission_KEY,context.getHandler());

    if (!requiredPermissions || requiredPermissions.length === 0) 
    {
      return true;
    }

    const user: HR = req.User;
    const hrPermissions: HRPermissions[] | undefined = user.permissions;

   if(!hrPermissions)
   {
    throw new UnauthorizedException("You are not authorized")
   }

    const hasPermission = requiredPermissions.some((perm)=>hrPermissions.includes(perm));
   if(!hasPermission)
   {
     throw new UnauthorizedException("You are not authorized")
   }
   else 
   {
    return true
   }
  }
}
