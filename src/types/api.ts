import { Employee } from "./employee";
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}
  
export type EmployeeListResponse = ApiResponse<Employee[]>;
export type EmployeeDetailResponse = ApiResponse<Employee>;