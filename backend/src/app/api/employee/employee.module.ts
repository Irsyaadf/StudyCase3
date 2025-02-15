/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { EmployeeController } from './route';
import { EmployeeService } from '../../../services/employee.service';
import { EmployeeRepository } from './repositories';
import { PrismaService } from '../../../lib/prisma';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService, EmployeeRepository, PrismaService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
