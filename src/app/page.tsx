"use client"

import { redirect } from "next/navigation";

export default function Home() {
  redirect("/employee");
  return null;
}
