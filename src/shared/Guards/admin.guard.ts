import { AdminRepository } from "@Models/Users";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Roles } from "@Shared/Enums";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly adminRepository: AdminRepository) {}

  async canActivate(context:ExecutionContext):Promise<boolean> 
  {
    const req = context.switchToHttp().getRequest();
    const User = req.User;

    if(!User)throw new UnauthorizedException("1");
    

    if(User.Role !== Roles.Admin)throw new UnauthorizedException("2");
    

    const exists = await this.adminRepository.FindOne({_id:User._id});
    if(!exists)throw new UnauthorizedException("3");
    

    return true;
  }
}
