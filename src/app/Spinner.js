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
}) {
  const spinnerSize = typeof size === "number" ? size : sizes[size] || sizes.md;

  return (
    <div
      role="status"
      aria-label="جار التحميل"
      className={`mt-14 flex items-center justify-center ${className}`}
    >
      <motion.span
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: speed, ease: "linear" }}
        style={{
          width: spinnerSize,
          height: spinnerSize,
          borderWidth: spinnerSize * 0.12,
          borderColor: `${color} transparent transparent transparent`,
        }}
        className="rounded-full border-solid border-t-[transparent] border-r-[transparent] border-b-[transparent]"
      />
    </div>
  );
}
