import { JwtPayload } from "jsonwebtoken"

export interface ITokenPayload extends JwtPayload
{
id:string
FullName:string
Email:string
Role:string
}
