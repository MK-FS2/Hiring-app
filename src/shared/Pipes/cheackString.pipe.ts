import { PipeTransform, BadRequestException } from '@nestjs/common';

export class ValidStringPipe implements PipeTransform {
  private minlength?: number;
  private maxlength?: number;

  constructor(min?: number, max?: number) 
  {
    this.minlength = min;
    this.maxlength = max;
  }

  transform(value: any) 
  {
    if (typeof value !== 'string') 
    {
      throw new BadRequestException('Value must be a string');
    }

    const trimmed = value.trim();

    if (this.minlength !== undefined && trimmed.length < this.minlength) 
    {
      throw new BadRequestException(`String must be at least ${this.minlength} characters long`);
    }

    if (this.maxlength !== undefined && trimmed.length > this.maxlength) 
    {
      throw new BadRequestException(`String must be at most ${this.maxlength} characters long`,);
    }

    return trimmed;
  }
}
