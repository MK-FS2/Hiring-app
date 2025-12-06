import { SetMetadata } from "@nestjs/common";
import { Permission_KEY } from "@Shared/constants";
import { HRPermissions } from "@Shared/Enums";



export const  SetPermissions = (...Permissions:HRPermissions[])=> SetMetadata(Permission_KEY,Permissions)