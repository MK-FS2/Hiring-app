import { Token, TokenRepository, TokenSchema } from "@Models/Token";
import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtService } from "@nestjs/jwt";



@Global()
@Module(
{
imports:[MongooseModule.forFeature([{name:Token.name,schema:TokenSchema}])],
providers:[TokenRepository,JwtService,ConfigService],
exports:[TokenRepository,JwtService]
})
export class GlobalModule {}