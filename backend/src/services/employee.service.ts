import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EmployeeRepository } from '../app/api/employee/repositories';
import { Employee } from '@prisma/client';

@Injectable()
export class EmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async findAll() {
    return this.employeeRepository.findAll();
  }

  async findById(id: number) {
    return this.employeeRepository.findById(id);
  }

  async create(data: any) {
    return this.employeeRepository.create(data);
  }

  async update(id: number, data: any) {
    return this.employeeRepository.update(id, data);
  }

  async softDelete(id: number, updatedBy: string) {
    const employee = await this.employeeRepository.findById(id);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    return this.employeeRepository.softDelete(id, updatedBy);
  }

  async restore(id: number) {
    console.log(`Searching deleted employee with ID: ${id}`);
  
    // Cari hanya employee yang sudah dihapus
    const deletedEmployees = await this.findDeleted();
    const employee = deletedEmployees.find(emp => emp.id === id);
  
    if (!employee) {
      console.log("Employee NOT found in deleted records");
      throw new NotFoundException("Employee not found for restoration");
    }
  
    // Restore employee
    await this.employeeRepository.restore(id);
  
    // Ambil ulang data setelah restore
    const restoredEmployee = await this.findById(id);
  
    console.log("Restored Employee:", restoredEmployee);
    return restoredEmployee;
  }  
  
  async findDeleted(): Promise<Employee[]> {
    return this.employeeRepository.findDeleted();
  }  
}
