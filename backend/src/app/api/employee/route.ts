/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  HttpCode,
  NotFoundException,
  BadRequestException,
  Query,
  ParseIntPipe,
  InternalServerErrorException,
} from '@nestjs/common';
import { EmployeeService } from '../../../services/employee.service';
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  SoftDeleteEmployeeDto,
} from '../../api/employee/dto';
import { ApiResponse } from '../../../utils/api-respons';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  @HttpCode(200)
  async findAll() {
    const employees = await this.employeeService.findAll();
    console.log('Fetching all employees...');
    return ApiResponse.success('Employees retrieved successfully', employees);
  }

  @Get('deleted')
  @HttpCode(200)
  async getDeletedEmployees() {
    try {
      const deletedEmployees = await this.employeeService.findDeleted();
      console.log('Deleted Employees:', deletedEmployees);
      return ApiResponse.success(
        'Deleted employees retrieved',
        deletedEmployees,
      );
    } catch (error) {
      console.error('Error fetching deleted employees:', error);
      throw new InternalServerErrorException(
        'Failed to fetch deleted employees',
      );
    }
  }

  @Post()
  @HttpCode(201)
  async create(@Body() data: CreateEmployeeDto) {
    if (!data.firstName || !data.lastName) {
      throw new BadRequestException(
        ApiResponse.error('First and last name are required', 400),
      );
    }
    const newEmployee = await this.employeeService.create(data);
    return ApiResponse.success('Employee created successfully', newEmployee);
  }

  @Post('restore/:id') 
  @HttpCode(200)
  async restoreEmployee(@Param('id', ParseIntPipe) id: number) {
    const restoredEmployee = await this.employeeService.restore(id);
    if (!restoredEmployee) {
      throw new NotFoundException(
        ApiResponse.error('Employee not found for restoration', 404),
      );
    }
    return ApiResponse.success(
      'Employee restored successfully',
      restoredEmployee,
    );
  }

  @Get(':id') 
  @HttpCode(200)
  async findById(@Param('id', ParseIntPipe) id: number) {
    const employee = await this.employeeService.findById(id);
    if (!employee) {
      throw new NotFoundException(ApiResponse.error('Employee not found', 404));
    }
    return ApiResponse.success('Employee retrieved successfully', employee);
  }

  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateEmployeeDto,
  ) {
    if (!data.updatedBy) {
      throw new BadRequestException(
        ApiResponse.error('updatedBy is required for update', 400),
      );
    }

    const updatedEmployee = await this.employeeService.update(id, data);
    if (!updatedEmployee) {
      throw new NotFoundException(
        ApiResponse.error('Employee not found for update', 404),
      );
    }
    return ApiResponse.success(
      'Employee updated successfully',
      updatedEmployee,
    );
  }

  @Delete(':id')
  @HttpCode(200)
  async deleteEmployee(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: SoftDeleteEmployeeDto = { updatedBy: 'admin'}, 
  ) {


    if (!body.updatedBy) {
      throw new BadRequestException(
        ApiResponse.error('updatedBy is required for deletion', 400),
      );
    }

    const deletedEmployee = await this.employeeService.softDelete(
      id,
      body.updatedBy,
    );

    if (!deletedEmployee) {
      throw new NotFoundException(
        ApiResponse.error('Employee not found for deletion', 404),
      );
    }

    console.log(`Employee with ID ${id} deleted successfully.`);
    return ApiResponse.success(
      'Employee deleted successfully',
      deletedEmployee,
    );
  }
}
