// app/menu/components/EmptyResults.js
import { motion } from "framer-motion";

const EmptyResults = ({ show }) => {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-12"
    >
      <p className="text-white/60 text-xl">لا توجد نتائج للبحث</p>
      <p className="text-white/40 text-sm mt-2">
        جرب البحث بكلمات أخرى أو اختر فئة مختلفة
      </p>
    </motion.div>
  );
};

export default EmptyResults;
