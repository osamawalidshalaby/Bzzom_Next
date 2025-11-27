"use client";
import { motion } from "framer-motion";

/**
 * مكون مؤشر التحميل
 * مؤشر تحميل سلس وقابل للتخصيص لتطبيقات React
 * - يستخدم Tailwind CSS + Framer Motion
 * - اللون الافتراضي: #C49A6C (درجة البني الذهبي)
 */

const sizes = {
  sm: 20,
  md: 36,
  lg: 52,
  xl: 72,
};

export default function Spinner({
  size = "lg",
  speed = 1.2,
  color = "#C49A6C",
  className = "",
  text = "جارى التحميل",
}) {
  const spinnerSize = typeof size === "number" ? size : sizes[size] || sizes.md;

  return (
    <div
      role="status"
      aria-label="جار التحميل"
      className={`fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-90 z-50 ${className}`}
    >
      {/* Spinner */}
      <motion.span
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: speed, ease: "linear" }}
        style={{
          width: spinnerSize,
          height: spinnerSize,
          borderWidth: spinnerSize * 0.12,
          borderColor: `${color} transparent transparent transparent`,
        }}
        className="rounded-full border-solid border-t-transparent border-r-transparent border-b-transparent mb-4"
      />

      {/* نص التحميل */}
      <p className="text-white text-lg font-medium mt-4 rtl">{text}</p>
    </div>
  );
}
