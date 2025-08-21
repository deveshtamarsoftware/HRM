import React from "react";
import logo from "../assets/logo.png";
import backgroundImage from "../assets/Office.jpg";

interface AuthFormLayoutProps {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function AuthFormLayout({ title, children, footer }: AuthFormLayoutProps) {
  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Card container */}
      <div className="relative p-8 rounded-2xl shadow-lg bg-white/10 backdrop-blur-lg text-white max-w-md w-full">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="HRMS Logo" className="h-16" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 text-center">{title}</h1>

        {/* Form content */}
        {children}

        {/* Footer content */}
        {footer && <div className="mt-4 text-center">{footer}</div>}
      </div>
    </div>
  );
}
