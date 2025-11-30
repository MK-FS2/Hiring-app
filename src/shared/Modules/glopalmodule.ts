import { Token, TokenRepository, TokenSchema } from "@Models/Token";
import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtService } from "@nestjs/jwt";
import { CloudServices } from "@Shared/Utils/Cloud";



@Global()
@Module(
{
imports:[MongooseModule.forFeature([{name:Token.name,schema:TokenSchema}])],
providers:[TokenRepository,JwtService,ConfigService,CloudServices],
exports:[TokenRepository,JwtService,ConfigService,CloudServices]
})
export class GlobalModule {}