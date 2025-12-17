import { Injectable } from "@nestjs/common";
import { Token } from "./Token.Schema";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import AbstractRepository from "@Models/AbstractRepository";

@Injectable()
export class TokenRepository extends AbstractRepository<Token> 
{
    constructor(@InjectModel(Token.name) private readonly TokenModel: Model<Token>) {
        super(TokenModel);
    }

    async blackListTokens(accessToken: string, refreshToken: string, userId: Types.ObjectId) 
    {
        try 
        {
        const document: Token = 
        {
            accessToken,
            refreshToken,
            userId
        };
         await this.TokenModel.create(document);
        return true
        }
        catch(err)
        {
            console.log(err)
        return false
        }
    }

    async checkAccessToken(accessToken: string, userId: Types.ObjectId): Promise<boolean> {
        const isBlacklisted = await this.TokenModel.findOne({ accessToken, userId });
        return !!isBlacklisted;
    }

    async checkRefreshToken(refreshToken: string, userId: Types.ObjectId): Promise<boolean> {
        const isBlacklisted = await this.TokenModel.findOne({ refreshToken, userId });
        return !!isBlacklisted;
    }
}
