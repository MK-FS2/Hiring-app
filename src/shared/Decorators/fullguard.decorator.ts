import { applyDecorators, UseGuards } from "@nestjs/common";
import { Roles } from "@Shared/Enums";
import { RolesAllowed } from "./allowedRoles.decorator";
import { AuthGuard } from "@Shared/Guards";
import { RoleGuard } from "@Shared/Guards/role.guard";



export const FullGuard = (...roles:Roles[])=> applyDecorators(RolesAllowed(...roles),UseGuards(AuthGuard,RoleGuard))
