export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  hireDate: string;
  salary: string;
  email: string;
  phoneNumber: string;
  status:
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED"
  | "PROBATION"
  
  | "TERMINATED"
  | "RESIGNED"
  | "RETIRED";  
  createdBy: string;
  createdAt: string;
  updatedBy: string | null;
  updatedAt: string;
  deletedAt: string | null;
}