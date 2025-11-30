import { Genders } from "@Shared/Enums";
import { EmailRegex, ISPastDate, PasswordRegex, PhoneRegex } from "@Shared/Validations";
import { IsDate, IsEnum, IsNotEmpty, IsString, Matches, Length } from 'class-validator';
import { Type } from 'class-transformer';


export class BaseUserDTO {
  @IsNotEmpty()
  @IsString()
  @Length(2, 20, { message: 'First name must be between 2 and 20 characters' })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 20, { message: 'Last name must be between 2 and 20 characters' })
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @Matches(EmailRegex, { message: 'Email format is invalid' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(PasswordRegex, { message: 'Password format is invalid' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @Matches(PhoneRegex, { message: 'Phone number format is invalid' })
  phoneNumber: string;

  @IsNotEmpty()
  @IsEnum(Genders, { message: 'Gender must be one of the defined enum values' })
  gender: Genders;

  @IsNotEmpty()
   @Type(() => Date)
  @IsDate({ message: 'Date of birth must be a valid date'})
  @ISPastDate()
  dateofbirth: Date;
}
