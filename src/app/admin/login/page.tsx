import React from "react";
import { Metadata } from "next";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Portal Sign In | Skywalks Holidays",
  description: "Secure login portal for Skywalks Holidays staff and department administrators.",
};

export default function AdminLoginPage() {
  return <AdminLoginForm />;
}
