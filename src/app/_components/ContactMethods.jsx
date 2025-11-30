"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, WheatIcon } from 'lucide-react';

const ContactMethods = ({ 
  onPhoneClick, 
  onWhatsAppClick, 
  onEmailClick, 
  onLocationClick 
}) => {
  const contactMethods = [
    {
      icon: Phone,
      label: 'الهاتف',
      value: ' 01007576444',
      action: () => onPhoneClick('01010882822'),
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      icon: WheatIcon,
      label: 'الواتساب',
      value: '01010882822',
      action: () => onWhatsAppClick('201010882822'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      icon: Mail,
      label: 'البريد الإلكتروني',
      value: 'bazzomrestaurant@gmail.com',
      action: () => onEmailClick('info@bazzom.com'),
      color: 'bg-red-600 hover:bg-red-700'
    },
    {
      icon: MapPin,
      label: 'العنوان',
      value: 'ميدان الساعة , بجوار, البوسطة, Damietta Governorate 34511',
      action: onLocationClick,
      color: 'bg-blue-600 hover:bg-blue-700'
    }
  ];

  return (
    <div className="space-y-3 md:space-y-4">
      {contactMethods.map((contact, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 + idx * 0.1 }}
          className="bg-zinc-900 p-3 md:p-4 rounded-xl border border-[#C49A6C]/20 hover:border-[#C49A6C] transition-all cursor-pointer group w-full"
          onClick={contact.action}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className={`p-2 rounded-lg ${contact.color} transition-all flex-shrink-0`}>
                <contact.icon size={20} className="text-white" />
              </div>
              <div className="min-w-0">
                <h4 className="text-base md:text-lg font-bold text-white wrap-break-word">{contact.label}</h4>
                <p className="text-white/70 text-sm md:text-base wrap-break-word">{contact.value}</p>
              </div>
            </div>
            <div className="text-[#C49A6C] opacity-0 group-hover:opacity-100 transition-opacity text-xs md:text-sm whitespace-nowrap">
              انقر للاتصال
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ContactMethods;