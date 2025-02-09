"use client";
import { useEffect } from "react";
import { toaster } from "@/components/ui/toaster";

interface IToasterWrapperProps {
  title: string;
  type: "error" | "success" | "warning" | "info";
}

export const ToasterWrapper = ({ title, type }: IToasterWrapperProps) => {
  useEffect(() => {
    if (!title) return;
  
    const timer = setTimeout(() => {
      toaster.create({
        id: `toast-${Date.now()}`,
        title,
        type,
        duration: 5000
      });
    }, 0);
  
    return () => clearTimeout(timer);
  }, [title, type]);
  return null;
};  
