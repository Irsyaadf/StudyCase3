import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Employee, EmployeeListResponse, EmployeeDetailResponse } from "@/types";

const BASE_URL = "http://localhost:3000/employees";

interface EmployeeState {
  employees: Employee[];
  deletedEmployees: Employee[];
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  deletedEmployees: [],
  loading: false,
  error: null,
};

// ✅ Fetch all employees
export const fetchEmployees = createAsyncThunk(
  "employees/fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get<EmployeeListResponse>(`${BASE_URL}`);
      return response.data.data;
    } catch (error) {
      console.error("Fetch employees error:", error.response?.data || error);
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch employees");
    }
  }
);

// ✅ Fetch deleted employees
export const fetchDeletedEmployees = createAsyncThunk(
  "employees/fetchDeleted",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get<EmployeeListResponse>(`${BASE_URL}/deleted`);
      return response.data.data;
    } catch (error) {
      console.error("Fetch deleted employees error:", error.response?.data || error);
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch deleted employees");
    }
  }
);

// ✅ Add employee
export const addEmployee = createAsyncThunk(
  "employees/add",
  async (data: Omit<Employee, "id">, thunkAPI) => {
    try {
      console.log("Adding employee:", data);
      const response = await axios.post<EmployeeDetailResponse>(`${BASE_URL}`, {
        ...data,
        status: "TERMINATED",
        createdBy: "admin",
        createdAt: new Date().toISOString(),
        updatedBy: "admin",
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      });
      return response.data.data;
    } catch (error) {
      console.error("Add employee error:", error.response?.data || error);
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to add employee");
    }
  }
);

// ✅ Update employee
export const updateEmployee = createAsyncThunk(
  "employees/update", // Redux action type
  async ({ id, data }: { id: string; data: Partial<Employee> }, thunkAPI) => {
    try {
      console.log("Updating employee:", id, data);
      const response = await axios.put<EmployeeDetailResponse>(`${BASE_URL}/${id}`, {
        ...data,
        updatedBy: "admin",
        updatedAt: new Date().toISOString(),
      });
      return response.data.data;
    } catch (error) {
      console.error("Update employee error:", error.response?.data || error);
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update employee");
    }
  }
);

// ✅ Soft delete employee
export const deleteEmployee = createAsyncThunk(
  "employees/delete",
  async (id: string, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      return id;
    } catch (error) {
      console.error("Delete employee error:", error.response?.data || error);
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete employee");
    }
  }
);

// ✅ Restore deleted employee
export const restoreEmployee = createAsyncThunk(
  "employees/restore",
  async (id: string, thunkAPI) => {
    try {
      const response = await axios.post<EmployeeDetailResponse>(`${BASE_URL}/restore/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("Restore employee error:", error.response?.data || error);
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to restore employee");
    }
  }
);

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDeletedEmployees.fulfilled, (state, action) => {
        state.deletedEmployees = action.payload;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.employees.push(action.payload);
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.map((emp) =>
          emp.id === action.payload.id ? action.payload : emp
        );
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        const deletedEmployee = state.employees.find((emp) => emp.id === action.payload);
        if (deletedEmployee) {
          state.deletedEmployees.push(deletedEmployee);
        }
        state.employees = state.employees.filter((emp) => emp.id !== action.payload);
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(restoreEmployee.fulfilled, (state, action) => {
        state.deletedEmployees = state.deletedEmployees.filter((emp) => emp.id !== action.payload.id);
        state.employees.push(action.payload);
      })
      .addCase(restoreEmployee.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default employeeSlice.reducer;
