import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../lib/prisma';
import { Employee, Prisma } from '@prisma/client';

@Injectable()
export class EmployeeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Employee[]> {
    return this.prisma.employee.findMany({
      where: { deletedAt: null }, // Hanya ambil yang belum dihapus
    });
  }

  async findById(id: number): Promise<Employee | null> {
    return this.prisma.employee.findFirst({
      where: { id, deletedAt: null }, // Jangan ambil data yang dihapus
    });
  }

  async create(data: Prisma.EmployeeCreateInput): Promise<Employee> {
    return this.prisma.employee.create({ data });
  }

  async update(id: number, data: Prisma.EmployeeUpdateInput): Promise<Employee> {
    return this.prisma.employee.update({ where: { id }, data });
  }

  async softDelete(id: number, updatedBy: string): Promise<Employee> {
    return this.prisma.employee.update({
      where: { id },
      data: { deletedAt: new Date(), updatedBy },
    });
  }

  async restore(id: number): Promise<Employee> {
    return this.prisma.employee.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async findDeleted(): Promise<Employee[]> {
    return this.prisma.employee.findMany({
      where: { deletedAt: { not: null } }, // Mengambil data yang sudah "soft deleted"
    });
  }  
}
