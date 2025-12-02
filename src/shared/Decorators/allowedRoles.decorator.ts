
import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '@Shared/constants';
import { Roles } from '@Shared/Enums';


export const RolesAllowed = (...roles: Roles[]) => SetMetadata(ROLES_KEY, roles);
