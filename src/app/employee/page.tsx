"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmployees,
  deleteEmployee,
  addEmployee,
  updateEmployee,
} from "@/store/slices/employeeSlice";
import { RootState, AppDispatch } from "@/store/store";
import "@ant-design/v5-patch-for-react-19";
import {
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Dropdown,
  Menu,
  Popconfirm,
  Row,
  Col,
  Space,
  message,
} from "antd";
import {
  SettingOutlined,
  ReloadOutlined,
  DownOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Employee } from "@/types";
import { EMPLOYEE_STATUSES } from "@/lib/constants";
import { formatDate, getStatusColor } from "@/lib/utils";

const { Option } = Select;

export default function EmployeeListPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { employees, loading } = useSelector(
    (state: RootState) => state.employees
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [tableSize, setTableSize] = useState<"small" | "middle" | "large">(
    "middle"
  );
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchEmployees());
    setSelectedColumns(columns.map((col) => col.key as string));
  }, [dispatch]);

  const showModal = (employee?: Employee) => {
    if (employee) {
      setCurrentEmployee(employee);
      form.setFieldsValue({
        ...employee,
        hireDate: employee.hireDate ? dayjs(employee.hireDate) : null,
        status: employee.status,  
      });
    } else {
      setCurrentEmployee(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => setIsModalOpen(false);

  const handleCreateEmployee = async () => {
    try {
      const values = await form.validateFields();
      const newEmployee = {
        ...values,
        hireDate: values.hireDate.toISOString(),
        status: values.status || "ACTIVE",
        createdBy: "admin", 
        createdAt: new Date().toISOString(),
        updatedBy: "admin",
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      };
      
      await dispatch(addEmployee(newEmployee)).unwrap();
      message.success("Employee added successfully");
      setIsModalOpen(false);
      dispatch(fetchEmployees());
    } catch (error) {
      message.error("Failed to add employee");
    }
  };
  
  const handleUpdateEmployee = async () => {
    if (!currentEmployee) return;
    
    try {
      const values = await form.validateFields();
      const updatedEmployee = {
        ...values,
        hireDate: values.hireDate.toISOString(),
        updatedBy: "admin",
        updatedAt: new Date().toISOString(),
      };
      
      await dispatch(updateEmployee({ id: currentEmployee.id, data: updatedEmployee })).unwrap();
      message.success("Employee updated successfully");
      setIsModalOpen(false);
      dispatch(fetchEmployees()); // Refresh list
    } catch (error) {
      message.error("Failed to update employee");
    }
  };  
  
  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteEmployee(id)).unwrap();
      message.success("Employee deleted successfully");
      dispatch(fetchEmployees()); // Refresh list
    } catch (error) {
      message.error("Failed to delete employee");
    }
  };

  const columns: ColumnsType<Employee> = [
    { title: "ID", dataIndex: "id", key: "id", align: "center" },
    {
      title: "Name",
      dataIndex: "firstName",
      key: "firstName",
      align: "center",
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align: "center",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      align: "center",
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      align: "center",
    },
    { title: "Salary", 
      dataIndex: "salary", 
      key: "salary", 
      align: "center" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: "Hire Date",
      dataIndex: "hireDate",
      key: "hireDate",
      align: "center",
      render: (date) => formatDate(date),
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      align: "center",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (date) => formatDate(date),
    },
    {
      title: "Updated By",
      dataIndex: "updatedBy",
      key: "updatedBy",
      align: "center",
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      align: "center",
      render: (date) => formatDate(date),
    },
    {
      title: "Deleted At",
      dataIndex: "deletedAt",
      key: "deletedAt",
      align: "center",
      render: (date) => formatDate(date),
    },
    {
      title: "Actions",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Dropdown
          menu={
            <Menu>
              <Menu.Item key="edit" onClick={() => showModal(record)}>
                Edit
              </Menu.Item>
              <Menu.Item key="delete">
                <Popconfirm
                  title="Are you sure?"
                  onConfirm={() => handleDelete(record.id)}
                >
                  Delete
                </Popconfirm>
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button>
            Actions <DownOutlined />
          </Button>
        </Dropdown>
      ),
    },
  ];

  // Filter untuk hanya menampilkan karyawan yang tidak terhapus
  const activeEmployees = employees.filter(
    (employee) => !employee.isDeleted && employee.status !== "DELETED"
  );

  return (
    <div className="p-10">
      <div className="flex justify-between mb-4">
        <Button type="primary" onClick={() => showModal()}>
          Add Employee
        </Button>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => dispatch(fetchEmployees())}
          >
            Reload
          </Button>
        </Space>
      </div>

      <Table
        columns={columns.filter((col) =>
          selectedColumns.includes(col.key as string)
        )}
        dataSource={activeEmployees} 
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }}
        size={tableSize}
      />

      <Modal
        title={currentEmployee ? "Edit Employee" : "Add New Employee"}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={currentEmployee ? handleUpdateEmployee : handleCreateEmployee}
        >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true }]}
              >
                <Input type="email" />
              </Form.Item>
              <Form.Item label="Phone" name="phoneNumber">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Position"
                name="position"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Department"
                name="department"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Salary"
                name="salary"
                rules={[{ required: true }]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item
                label="Hire Date"
                name="hireDate"
                rules={[{ required: true }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Status" name="status" rules={[{ required: true }]}>
        <Select>
          {EMPLOYEE_STATUSES.map((status) => (
            <Option key={status} value={status}>
              {status}
            </Option>
          ))}
        </Select>
      </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
