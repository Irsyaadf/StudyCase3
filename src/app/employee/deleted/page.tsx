"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDeletedEmployees,
  restoreEmployee,
} from "@/store/slices/employeeSlice";
import { RootState, AppDispatch } from "@/store/store";
import "@ant-design/v5-patch-for-react-19";
import { Table, Tag, Button, Popconfirm, Space } from "antd";
import { ReloadOutlined, RollbackOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Employee } from "@/types";
import { formatDate, getStatusColor } from "@/lib/utils";

export default function DeletedEmployeeListPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { deletedEmployees, loading } = useSelector(
    (state: RootState) => state.employees
  );

  console.log("🔍 Deleted Employees:", deletedEmployees);
  useEffect(() => {
    dispatch(fetchDeletedEmployees());
  }, [dispatch]);

  const handleRestore = async (id: string) => {
    try {
      await dispatch(restoreEmployee(id)).unwrap(); // Tunggu proses restore selesai
      dispatch(fetchDeletedEmployees()); // Reload data setelah restore sukses
    } catch (error) {
      console.error("Restore failed:", error);
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
    { title: "Email", dataIndex: "email", key: "email", align: "center" },
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
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Hire Date",
      dataIndex: "hireDate",
      key: "hireDate",
      align: "center",
      render: (date) => formatDate(date),
    },
    {
      title: "Actions",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Popconfirm
          title="Restore this employee?"
          onConfirm={() => handleRestore(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button icon={<RollbackOutlined />} type="primary">
            Restore
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="p-10">
      <div className="flex justify-between mb-4">
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => dispatch(fetchDeletedEmployees())}
            loading={loading}
          >
            Reload
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={deletedEmployees}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}
