import { BadRequestException, CanActivate, ExecutionContext } from '@nestjs/common';
import { Roles } from '@Shared/Enums';
import { Reflector } from "@nestjs/core";
import { Public_Key } from '@Shared/constants';



export class RoleGuard implements CanActivate 
{
  constructor(private readonly AllowedRoles: Roles[],private readonly reflector:Reflector) {}

  canActivate(context: ExecutionContext) 
  {
    try
     {

     const publiCheck = this.reflector.getAllAndMerge(Public_Key,[context.getHandler(),context.getClass()])

      if(publiCheck.includes(true)) 
      {
        return true;
      }

      const req = context.switchToHttp().getRequest();
      const user: any = req.User;

      if (!user || !user.Role) 
      {
        throw new BadRequestException('User role not found');
      }

      const userRole: Roles | undefined = Object.values(Roles).find(r => r === user.Role);

      if (userRole && this.AllowedRoles.includes(userRole)) 
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
