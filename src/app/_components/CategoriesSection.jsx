// CategoriesSection.jsx
"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HorizontalScrollContainer from './HorizontalScrollContainer';



const CategoriesSection = ({categories}) => {
  return (
    <section className="py-4 md:py-6 px-4 bg-linear-to-b from-zinc-900 via-zinc-900 to-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-xl md:text-3xl font-bold text-[#C49A6C]">
            الأقسام
          </h2>
          <button className="text-white/70 hover:text-[#C49A6C] font-semibold transition-colors text-xs md:text-sm">
            <Link href="/menu">عرض الكل</Link>
          </button>
        </div>

        {/* Desktop Center Layout */}
        <div className="hidden md:flex justify-center">
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl">
            {categories.map((category) => (
              <div key={category.id} className="cursor-pointer">
                <Link href={'/menu'}>
                  <div className="bg-black/40 rounded-xl p-1.5 border border-[#C49A6C]/20 transition-all w-20 hover:border-[#C49A6C]">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden mb-1.5 bg-zinc-800 border border-[#C49A6C]/30 mx-auto">
                      <Image
                        src={category.image_url}
                        alt={category.name_ar}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-center text-[10px] font-semibold text-white transition-colors leading-tight hover:text-[#C49A6C]">
                      {category.name_ar}
                    </h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden">
          <HorizontalScrollContainer>
            {categories.map((category) => (
              <div
                key={category.id}
                className="cursor-pointer shrink-0 group"
                style={{ minWidth: '90px', maxWidth: '90px' }}
              >
                <Link href={'/menu'}>
                  <div className="bg-black/40 rounded-xl p-1.5 border border-[#C49A6C]/20 transition-all group-hover:border-[#C49A6C]">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden mb-1.5 bg-zinc-800 border border-[#C49A6C]/30 mx-auto">
                      <Image
                        src={category.image_url}
                        alt={category.name_ar}
                        fill
                        priority={true}   
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-center text-[10px] font-semibold text-white transition-colors leading-tight group-hover:text-[#C49A6C]">
                      {category.name_ar}
                    </h3>
                  </div>
                </Link>
              </div>
            ))}
          </HorizontalScrollContainer>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;