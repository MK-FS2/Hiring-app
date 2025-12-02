/* eslint-disable @typescript-eslint/no-unsafe-return */
import { createParamDecorator, ExecutionContext } from "@nestjs/common";





export const UserData = createParamDecorator(
    (data:any,context:ExecutionContext)=>
    {
    const req = context.switchToHttp().getRequest()
    const user =req.User
    return data? user?.[data]: user
    }
)