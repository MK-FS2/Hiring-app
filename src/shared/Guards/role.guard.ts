import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Roles } from '@Shared/Enums';
import { Reflector } from "@nestjs/core";
import { Public_Key, ROLES_KEY } from '@Shared/constants';


@Injectable()
export class RoleGuard implements CanActivate 
{
  constructor(private readonly reflector:Reflector) {}

  canActivate(context: ExecutionContext) 
  {
    try
     {
      
     const publiCheck = this.reflector.getAllAndMerge(Public_Key,[context.getHandler(),context.getClass()])

      if(publiCheck.includes(true)) 
      {
        return true;
      }

      const AllowedRoles = this.reflector.getAllAndMerge(ROLES_KEY,[context.getHandler(),context.getClass()])

      const req = context.switchToHttp().getRequest();
      const user: any = req.User;

      if (!user || !user.Role) 
      {
        throw new BadRequestException('User role not found');
      }

      const userRole: Roles | undefined = Object.values(Roles).find(r => r === user.Role);

      if (userRole && AllowedRoles.includes(userRole)) 
      {
        return true;
      }

      return false;
    } 
    catch (err) 
    {
      throw new BadRequestException(err.message);
    }
  }
}
