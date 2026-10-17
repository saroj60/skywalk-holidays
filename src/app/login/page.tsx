import React from "react";
import { Metadata } from "next";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin & Staff Login | Skywalks Holidays Control Portal",
  description: "Secure login portal for Skywalks Holidays staff and department administrators.",
};

export default function LoginPage() {
  return <AdminLoginForm />;
}
