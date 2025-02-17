import { useState } from "react";
import { Button, Checkbox, Modal } from "antd";
import { SettingOutlined } from "@ant-design/icons";

const ALL_COLUMNS = [
  { key: "id", label: "ID" },
  { key: "firstName", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phoneNumber", label: "Phone" },
  { key: "department", label: "Department" },
  { key: "position", label: "Position" },
  { key: "salary", label: "Salary" },
  { key: "status", label: "Status" },
  { key: "hireDate", label: "Hire Date" },
  { key: "createdBy", label: "Created By" },
  { key: "createdAt", label: "Created At" },
  { key: "updatedBy", label: "Updated By" },
  { key: "updatedAt", label: "Updated At" },
  { key: "deletedAt", label: "Deleted At" },
];

const DEFAULT_COLUMNS = [
  "id",
  "firstName",
  "email",
  "phoneNumber",
  "department",
  "position",
  "salary",
  "status",
  "hireDate",
];

interface ColumnSettingsProps {
  selectedColumns: string[];
  setSelectedColumns: (columns: string[]) => void;
}

export default function ColumnSettings({
  selectedColumns,
  setSelectedColumns,
}: ColumnSettingsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleColumn = (columnKey: string) => {
    if (selectedColumns.includes(columnKey)) {
      setSelectedColumns(selectedColumns.filter((col) => col !== columnKey));
    } else {
      setSelectedColumns([...selectedColumns, columnKey]);
    }
  };

  return (
    <>
      <Button icon={<SettingOutlined />} onClick={() => setIsModalOpen(true)}>
        Settings
      </Button>
      <Modal
        title="Select Columns"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => setIsModalOpen(false)}
      >
        {ALL_COLUMNS.map((col) => (
          <Checkbox
            key={col.key}
            checked={selectedColumns.includes(col.key)}
            onChange={() => handleToggleColumn(col.key)}
          >
            {col.label}
          </Checkbox>
        ))}
      </Modal>
    </>
  );
}
