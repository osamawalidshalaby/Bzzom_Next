"use client";
import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-black py-8 md:py-12 px-4 border-t border-[#C49A6C]/20 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4 flex justify-start">
              <Image 
                src="/logo.png"
                alt="Bazzom Logo"
                width={64}
                height={64}
                className="h-12 md:h-16 w-auto object-contain" 
              />
            </div>
            <p className="text-white/60 mb-6 text-sm md:text-base wrap-break-word max-w-md">
              مطعم بزوم - الطعم الأصيل | The Authentic Taste
              <br />
              نقدم أشهى الأطباق العربية الأصيلة بأعلى مستويات الجودة والنكهة
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.facebook.com/Bazzom.restaurant.Egy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/60 hover:text-[#C49A6C] transition-all"
              >
                <Facebook size={24} />
              </a>
              <a 
                href="https://www.instagram.com/bazzom.egy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/60 hover:text-[#C49A6C] transition-all"
              >
                <Instagram size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-[#C49A6C] mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-white/60 hover:text-[#C49A6C] transition-all">الرئيسية</Link></li>
              <li><Link href="/menu" className="text-white/60 hover:text-[#C49A6C] transition-all">قائمة الطعام</Link></li>
              <li><Link href="/about" className="text-white/60 hover:text-[#C49A6C] transition-all">عن المطعم</Link></li>
              <li><Link href="/contact" className="text-white/60 hover:text-[#C49A6C] transition-all">اتصل بنا</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-[#C49A6C] mb-4">معلومات التواصل</h4>
            <ul className="space-y-2 text-white/60 text-sm">
              <li>دمياط، ميدان الساعة</li>
              <li>bazzomrestaurant@gmail.com</li>
              <li>01010882822</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 pt-6 text-center">
          <p className="text-white/60 text-sm">
            جميع الحقوق محفوظة © 2025 مطعم بزوم | تصميم وتطوير بفخر
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;