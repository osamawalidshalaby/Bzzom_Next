'use client';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const ReviewCard = ({ review }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-zinc-900 rounded-xl p-4 md:p-6 border border-[#C49A6C]/20"
    >
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h3 className="text-lg md:text-xl font-bold text-white">{review.name}</h3>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={18}
              className={i < review.rating ? 'fill-[#C49A6C] text-[#C49A6C]' : 'text-white/20'}
            />
          ))}
        </div>
      </div>
      <p className="text-white/70 text-sm md:text-base">{review.review}</p>
    </motion.div>
  );
};

export default ReviewCard;