import { SetMetadata } from "@nestjs/common";
import { Public_Key } from "@Shared/constants";



export const MakePublic = (option:boolean) => SetMetadata(Public_Key,option)