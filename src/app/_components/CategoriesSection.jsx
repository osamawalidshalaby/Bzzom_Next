
// "use client";
// import React from 'react';
// import { motion } from 'framer-motion';
// import Image from 'next/image';
// import Link from 'next/link';
// import HorizontalScrollContainer from './HorizontalScrollContainer';


// const categories = [
//     {
//     id: 5,
//     title: 'مأكولات',
//     image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
//     link: '/category/food'
//   },
//   {
//     id: 6,
//     title: 'مشروبات',
//     image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
//     link: '/category/drinks'
//   },
//   {
//     id: 7,
//     title: 'حلويات',
//     image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
//     link: '/category/desserts'
//   },
//   {
//     id: 8,
//     title: 'مقبلات',
//     image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
//     link: '/category/appetizers'
//   },
//   {
//   id: 9,
//   title: 'مخبوزات',
//   image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
//   link: '/category/bakery'
// },
// {
//   id: 10,
//   title: 'وجبات سريعة',
//   image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
//   link: '/category/fastfood'
// },
// {
//   id: 11,
//   title: 'مكسرات',
//   image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
//   link: '/category/nuts'
// }
// ];


// const CategoriesSection = () => {
//   return (
//     <section className="py-4 md:py-6 px-4 bg-linear-to-b from-zinc-900 via-zinc-900 to-black">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-4 md:mb-6">
//           <motion.h2
//             initial={{ opacity: 0, x: 20 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             className="text-xl md:text-3xl font-bold text-[#C49A6C]"
//           >
//             الأقسام
//           </motion.h2>
//           <motion.button
//             initial={{ opacity: 0, x: -20 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="text-white/70 hover:text-[#C49A6C] font-semibold transition-colors text-xs md:text-sm"
//           >
//             <Link href="/menu">عرض الكل</Link>
//           </motion.button>
//         </div>

//         <HorizontalScrollContainer>
//           {categories.map((category, index) => (
//             <motion.div
//               key={category.id}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: index * 0.1 }}
//               whileHover={{ scale: 1.05 }}
//               className="group cursor-pointer shrink-0"
//               style={{ minWidth: '110px', maxWidth: '110px' }}
//             >
//               <Link href={'/menu'}>
//                 <div className="bg-black/40 rounded-2xl p-2 border border-[#C49A6C]/20 hover:border-[#C49A6C] transition-all">
//                   <div className="relative w-20 h-20 rounded-full overflow-hidden mb-2 bg-zinc-800 border-2 border-[#C49A6C]/30 mx-auto">
//                     <Image
//                       src={category.image}
//                       alt={category.title}
//                       fill
//                       className="object-cover group-hover:scale-110 transition-transform duration-300"
//                     />
//                   </div>
//                   <h3 className="text-center text-xs font-semibold text-white group-hover:text-[#C49A6C] transition-colors leading-tight">
//                     {category.title}
//                   </h3>
//                 </div>
//               </Link>
//             </motion.div>
//           ))}
//         </HorizontalScrollContainer>
//       </div>
//     </section>
//   );
// };

// export default CategoriesSection;

"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import HorizontalScrollContainer from './HorizontalScrollContainer';

const categories = [
  {
    id: 5,
    title: 'مأكولات',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    link: '/category/food'
  },
  {
    id: 6,
    title: 'مشروبات',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    link: '/category/drinks'
  },
  {
    id: 7,
    title: 'حلويات',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    link: '/category/desserts'
  },
  {
    id: 8,
    title: 'مقبلات',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    link: '/category/appetizers'
  },
  {
    id: 9,
    title: 'مخبوزات',
    image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    link: '/category/bakery'
  },
  {
    id: 10,
    title: 'وجبات سريعة',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    link: '/category/fastfood'
  },
  {
    id: 11,
    title: 'مكسرات',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    link: '/category/nuts'
  }
];

const CategoriesSection = () => {
  return (
    <section className="py-4 md:py-6 px-4 bg-linear-to-b from-zinc-900 via-zinc-900 to-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <motion.h2
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-xl md:text-3xl font-bold text-[#C49A6C]"
          >
            الأقسام
          </motion.h2>
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-white/70 hover:text-[#C49A6C] font-semibold transition-colors text-xs md:text-sm"
          >
            <Link href="/menu">عرض الكل</Link>
          </motion.button>
        </div>

        {/* Desktop Center Layout */}
        <div className="hidden md:flex justify-center">
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl"> {/* تحديد أقصى عرض ومركزية */}
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="cursor-pointer"
              >
                <Link href={'/menu'}>
                  <div className="bg-black/40 rounded-xl p-1.5 border border-[#C49A6C]/20 transition-all w-20"> {/* تحديد عرض ثابت */}
                    <div className="relative w-16 h-16 rounded-full overflow-hidden mb-1.5 bg-zinc-800 border border-[#C49A6C]/30 mx-auto">
                      <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-center text-[10px] font-semibold text-white transition-colors leading-tight">
                      {category.title}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden">
          <HorizontalScrollContainer>
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="cursor-pointer shrink-0"
                style={{ minWidth: '90px', maxWidth: '90px' }}
              >
                <Link href={'/menu'}>
                  <div className="bg-black/40 rounded-xl p-1.5 border border-[#C49A6C]/20 transition-all">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden mb-1.5 bg-zinc-800 border border-[#C49A6C]/30 mx-auto">
                      <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-center text-[10px] font-semibold text-white transition-colors leading-tight">
                      {category.title}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </HorizontalScrollContainer>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;