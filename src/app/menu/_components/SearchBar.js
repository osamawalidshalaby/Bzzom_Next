// app/menu/components/SearchBar.js
import { motion } from "framer-motion";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="max-w-2xl mx-auto mb-8"
    >
      <input
        type="text"
        placeholder="ابحث عن طبق... | Search for a dish..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 md:px-6 py-3 md:py-4 bg-zinc-900 border-2 border-[#C49A6C]/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#C49A6C] transition-all text-sm md:text-base"
      />
    </motion.div>
  );
};

export default SearchBar;
