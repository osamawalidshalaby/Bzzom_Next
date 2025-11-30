<<<<<<< HEAD
// HomeClient.js
"use client";
import { useState, useEffect } from "react";
=======

"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
>>>>>>> 90741381b159bb0bbfef273258d16b906108584a
import Link from "next/link";
import {
  CreditCard,
  Phone,
  Mail,
  MapPin,
  WheatIcon,
  Star,
  Clock,
  Users,
  Facebook,
  Instagram,
  Twitter,
  X,
  Plus,
  Minus,
  ShoppingCart,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useApp } from "./layout-client";

// Components
import ItemModal from "../app/_components/ItemModal";
import HorizontalScrollContainer from "../app/_components/HorizontalScrollContainer";
import DishCard from "../app/_components/DishCard";
import OfferCard from "../app/_components/OfferCard";
import ContactMethods from "../app/_components/ContactMethods";
import HeroSection from "../app/_components/HeroSection";
import RestaurantGallery from "../app/_components/RestaurantGallery";
import StatsSection from "../app/_components/StatsSection";
import Footer from "../app/_components/Footer";
import CategoriesSection from "../app/_components/CategoriesSection";

// Hooks
import { useCartSound } from "../app/_hooks/useCartSound";

import {
  slides,
  featuredDishes,
  offers,
  restaurantPhotos,
  paymentMethods,
} from "../app/_data/homeData";

<<<<<<< HEAD
export default function HomeClient({ slides, categories }) {
=======
export default function HomeClient() {
>>>>>>> 90741381b159bb0bbfef273258d16b906108584a
  const { addToCart } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { playAddToCartSound } = useCartSound();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const scrollToOffers = () => {
    const offersSection = document.getElementById("special-offers");
    if (offersSection) {
      offersSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePhoneClick = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`, "_self");
  };

  const handleWhatsAppClick = (phoneNumber) => {
    const message = "السلام عليكم 🌹\nأرغب في الحصول على معلومات عن المطعم";
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      "_blank"
    );
  };

  const handleEmailClick = (email) => {
    window.open(`mailto:${email}`, "_self");
  };

  const handleLocationClick = () => {
    window.open("https://maps.app.goo.gl/SZUdU2J9n4V5ZRfk6", "_blank");
  };

  const showToast = (message) => {
    toast.success(message, {
      duration: 2000,
      position: "bottom-left",
      style: {
        background: "#1f2937",
        color: "#fff",
        border: "1px solid #C49A6C",
      },
      icon: "✅",
    });
  };

  const handleAddToCart = (dish) => {
    addToCart({
      ...dish,
      quantity: 1,
    });

    showToast(`تم إضافة ${dish.name} إلى السلة! 🛒`);
    playAddToCartSound();
  };

  const handleAddOfferToCart = (offer) => {
    addToCart({
      id: `offer-${offer.id}`,
      name: offer.title,
      price: offer.price,
      image: offer.image,
      quantity: 1,
    });

    showToast(`تم إضافة ${offer.title} إلى السلة! 🛒`);
    playAddToCartSound();
  };

  const openItemDetails = (item, type) => {
    setSelectedItem({ ...item, type });
  };

  const closeItemDetails = () => {
    setSelectedItem(null);
  };

  const handleModalAddToCart = (itemWithQuantity) => {
    addToCart(itemWithQuantity);
    showToast(`تم إضافة ${itemWithQuantity.name} إلى السلة! 🛒`);
  };

  return (
    <>
      <Toaster
        position="bottom-left"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #C49A6C",
          },
        }}
      />

      <div className="min-h-screen bg-black text-white overflow-x-hidden">
        {/* Hero Section - 50vh */}
        <HeroSection
          slides={slides}
          currentSlide={currentSlide}
          goToSlide={goToSlide}
          scrollToOffers={scrollToOffers}
        />

        {/* Categories Section */}
<<<<<<< HEAD
        <CategoriesSection categories={categories} />
=======
        <CategoriesSection />
>>>>>>> 90741381b159bb0bbfef273258d16b906108584a

        {/* Featured Dishes Section */}
        <section className="py-12 md:py-20 px-4 bg-linear-to-b from-black to-zinc-900 w-full">
          <div className="max-w-7xl mx-auto w-full">
<<<<<<< HEAD
            <h2 className="text-3xl md:text-5xl font-bold text-[#C49A6C] mb-4 text-center wrap-break-word">
              أطباقنا المميزة
            </h2>
            <p className="text-lg md:text-xl text-white/60 mb-8 md:mb-12 text-center break-words">
              اكتشف أشهى أطباق مطعم بزوم
            </p>

            <HorizontalScrollContainer>
              {featuredDishes.map((dish) => (
=======
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold text-[#C49A6C] mb-4 text-center wrap-break-word"
            >
              أطباقنا المميزة
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-white/60 mb-8 md:mb-12 text-center break-words"
            >
              اكتشف أشهى الأطباق العربية الأصيلة
            </motion.p>

            <HorizontalScrollContainer>
              {featuredDishes.map((dish, idx) => (
>>>>>>> 90741381b159bb0bbfef273258d16b906108584a
                <DishCard
                  key={dish.id}
                  dish={dish}
                  onItemClick={openItemDetails}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </HorizontalScrollContainer>
          </div>
        </section>

        {/* Special Offers Section */}
        <section
          id="special-offers"
          className="py-4 md:py-8 px-4 bg-zinc-900 w-full"
        >
          <div className="max-w-7xl mx-auto w-full">
<<<<<<< HEAD
            <h2 className="text-3xl md:text-5xl font-bold text-[#C49A6C] mb-4 text-center wrap-break-word">
              العروض الخاصة
            </h2>
            <p className="text-lg md:text-xl text-white/60 mb-8 md:mb-12 text-center wrap-break-word">
              استفد من عروضنا الحصرية ووفر أكثر
            </p>

            <HorizontalScrollContainer>
              {offers.map((offer) => (
=======
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold text-[#C49A6C] mb-4 text-center wrap-break-word"
            >
              العروض الخاصة
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-white/60 mb-8 md:mb-12 text-center wrap-break-word"
            >
              استفد من عروضنا الحصرية ووفر أكثر
            </motion.p>

            <HorizontalScrollContainer>
              {offers.map((offer, idx) => (
>>>>>>> 90741381b159bb0bbfef273258d16b906108584a
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  onItemClick={openItemDetails}
                  onAddToCart={handleAddOfferToCart}
                />
              ))}
            </HorizontalScrollContainer>
          </div>
        </section>

        {/* Restaurant Photos Section */}
        <RestaurantGallery photos={restaurantPhotos} />

        {/* Contact & Payment Methods Section */}
        <section className="py-16 md:py-20 px-4 bg-black w-full">
          <div className="max-w-7xl mx-auto w-full">
<<<<<<< HEAD
            <h2 className="text-3xl md:text-5xl font-bold text-[#C49A6C] mb-8 md:mb-12 text-center wrap-break-word">
              تواصل معنا
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 w-full">
              {/* Contact Methods */}
              <div className="w-full">
=======
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold text-[#C49A6C] mb-8 md:mb-12 text-center wrap-break-word"
            >
              تواصل معنا
            </motion.h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 w-full">
              {/* Contact Methods */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="w-full"
              >
>>>>>>> 90741381b159bb0bbfef273258d16b906108584a
                <h3 className="text-2xl md:text-3xl font-bold text-[#C49A6C] mb-4 md:mb-6 wrap-break-word">
                  وسائل التواصل
                </h3>
                <ContactMethods
                  onPhoneClick={handlePhoneClick}
                  onWhatsAppClick={handleWhatsAppClick}
                  onEmailClick={handleEmailClick}
                  onLocationClick={handleLocationClick}
                />
<<<<<<< HEAD
              </div>

              {/* Payment Methods */}
              <div className="w-full">
=======
              </motion.div>

              {/* Payment Methods */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="w-full"
              >
>>>>>>> 90741381b159bb0bbfef273258d16b906108584a
                <h3 className="text-2xl md:text-3xl font-bold text-[#C49A6C] mb-4 md:mb-6 wrap-break-word">
                  طرق الدفع
                </h3>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  {paymentMethods.map((method, idx) => (
<<<<<<< HEAD
                    <div
                      key={idx}
=======
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
>>>>>>> 90741381b159bb0bbfef273258d16b906108584a
                      className="bg-zinc-900 p-3 md:p-4 rounded-xl border border-[#C49A6C]/20 text-center hover:border-[#C49A6C] transition-all w-full"
                    >
                      <CreditCard
                        className="text-[#C49A6C] mx-auto mb-2 md:mb-3"
                        size={24}
                      />
                      <h4 className="text-base md:text-lg font-bold text-white mb-1 md:mb-2 wrap-break-word">
                        {method.name}
                      </h4>
                      {method.number && (
                        <p className="text-[#C49A6C] font-mono text-xs md:text-sm wrap-break-word">
                          {method.number}
                        </p>
                      )}
<<<<<<< HEAD
                    </div>
=======
                    </motion.div>
>>>>>>> 90741381b159bb0bbfef273258d16b906108584a
                  ))}
                </div>

                {/* Working Hours */}
<<<<<<< HEAD
                <div className="bg-zinc-900 p-4 md:p-6 rounded-xl border border-[#C49A6C]/20 mt-4 md:mt-6 w-full">
=======
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="bg-zinc-900 p-4 md:p-6 rounded-xl border border-[#C49A6C]/20 mt-4 md:mt-6 w-full"
                >
>>>>>>> 90741381b159bb0bbfef273258d16b906108584a
                  <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                    <Clock className="text-[#C49A6C]" size={20} />
                    <h4 className="text-lg md:text-xl font-bold text-[#C49A6C]">
                      ساعات العمل
                    </h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm md:text-base">
<<<<<<< HEAD
                      <span className="text-white/70">الأحد - السبت</span>
                      <span className="text-white font-semibold">
                        11:00 ص - 2:00 ص
                      </span>
                    </div>
                  </div>
                </div>
              </div>
=======
                      <span className="text-white/70">الأحد - الخميس</span>
                      <span className="text-white font-semibold">
                        9:00 ص - 12:00 م
                      </span>
                    </div>
                    <div className="flex justify-between text-sm md:text-base">
                      <span className="text-white/70">الجمعة - السبت</span>
                      <span className="text-white font-semibold">
                        10:00 ص - 1:00 ص
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
>>>>>>> 90741381b159bb0bbfef273258d16b906108584a
            </div>
          </div>
        </section>

        {/* Quick Stats Section */}
        <StatsSection />

        {/* Footer */}
        <Footer />

        {/* Item Modal */}
<<<<<<< HEAD
        {selectedItem && (
          <ItemModal
            isOpen={!!selectedItem}
            onClose={closeItemDetails}
            item={selectedItem}
            type={selectedItem.type}
            onAddToCart={handleModalAddToCart}
            playAddToCartSound={playAddToCartSound}
          />
        )}
      </div>
    </>
  );
}
=======
        <AnimatePresence>
          {selectedItem && (
            <ItemModal
              isOpen={!!selectedItem}
              onClose={closeItemDetails}
              item={selectedItem}
              type={selectedItem.type}
              onAddToCart={handleModalAddToCart}
              playAddToCartSound={playAddToCartSound}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
>>>>>>> 90741381b159bb0bbfef273258d16b906108584a
