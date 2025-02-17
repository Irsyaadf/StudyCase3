"use client";

import { Layout, Menu, Dropdown } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";  

const { Header } = Layout;

export default function AppHeader() {
  const handleLogout = () => {
    console.log("User logged out");
  };

  const pathname = usePathname();
  const selectedKey = pathname.startsWith("/employee/deleted") ? "2" : "1"; 

  const userMenuItems = [
    {
      key: "logout",
      label: (
        <span onClick={handleLogout} className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-100">
          <LogoutOutlined />
          Logout
        </span>
      ),
    },
  ];

  return (
    <Header className="shadow-md flex items-center justify-between px-6 py-4" style={{ background: "white" }}>
      <div className="text-xl font-bold text-gray-800">
        <Link href="/">Employee Management</Link>
      </div>

      <Menu
        mode="horizontal"
        selectedKeys={[selectedKey]}
        className="border-none flex-1 justify-center bg-transparent"
        items={[
          { key: "1", label: <Link href="/employee" className="text-gray-700 hover:text-blue-600">Employees</Link> },
          { key: "2", label: <Link href="/employee/deleted" className="text-gray-700 hover:text-blue-600">Deleted Employees</Link> },
        ]}
      />

      <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
        <div className="cursor-pointer">
          <span className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100">
            <UserOutlined />
            Admin
          </span>
        </div>
      </Dropdown>
    </Header>
  );
}
