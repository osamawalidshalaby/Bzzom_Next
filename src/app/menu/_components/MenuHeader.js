// app/menu/components/MenuHeader.js
import { motion } from "framer-motion";

const MenuHeader = () => {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-4xl md:text-5xl font-bold text-[#C49A6C] mb-6 text-center"
    >
      قائمة الطعام
    </motion.h1>
  );
};

export default MenuHeader;
