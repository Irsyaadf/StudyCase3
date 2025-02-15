/* eslint-disable prettier/prettier */
import { 
  IsString, 
  IsNumber, 
  IsDateString, 
  IsOptional, 
  IsEmail 
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateEmployeeDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  position: string;

  @IsString()
  department: string;

  @IsDateString()
  hireDate: string;

  @IsString({ message: 'Salary must be a valid string' })
  @Transform(({ value }) => {
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  })
  salary: string; // Changed to string to handle the string type salary from the frontend

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @Transform(({ value }) => value.replace(/\D/g, "")) // Ensure only digits are allowed for phoneNumber
  phoneNumber: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  createdBy: string;
}

export class UpdateEmployeeDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  position?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsDateString()
  @IsOptional()
  hireDate?: string;

  @IsString({ message: 'Salary must be a valid string' })
  @Transform(({ value }) => {
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  })
  @IsOptional()
  salary?: string; // Changed to string

  @IsEmail({}, { message: 'Invalid email format' })
  @IsOptional()
  email?: string;

  @IsString()
  @Transform(({ value }) => value.replace(/\D/g, "")) // Ensure only digits for phone number
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString({ message: "UpdatedBy is required" })
  updatedBy: string;
}

export class SoftDeleteEmployeeDto {
  @IsString({ message: "UpdatedBy is required for delete" })
  @Transform(({ value }) => String(value))
  updatedBy: string;
}
