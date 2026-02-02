

// "use client";
// import React, { useState, useMemo } from 'react';
// import { motion } from 'framer-motion';
// import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
// import Image from 'next/image';

// const ItemModal = ({ 
//   isOpen, 
//   onClose, 
//   item, 
//   onAddToCart,
//   playAddToCartSound,
//   category = ""
// }) => {
//   // تحقق إذا كان العنصر من المشويات أو فئة تحتاج أحجام
//   const isGrillItem = category?.toLowerCase().includes("مشويات") || 
//                      category?.toLowerCase().includes("grill") ||
//                      item?.name?.toLowerCase().includes("مشوي") ||
//                      item?.category?.toLowerCase().includes("grill");

//   // أحجام المشويات وأسعارها
//   const grillSizes = [
//     { label: "1/4 كيلو", value: 0.25, multiplier: 0.25 },
//     { label: "1/3 كيلو", value: 0.33, multiplier: 0.33 },
//     { label: "1/2 كيلو", value: 0.5, multiplier: 0.5 }
//   ];

//   // تعيين الحجم الافتراضي مباشرة في useState
//   const [quantity, setQuantity] = useState(1);
//   const [selectedSize, setSelectedSize] = useState(isGrillItem ? 0.5 : null);

//   // حساب السعر باستخدام useMemo
//   const price = useMemo(() => {
//     if (!item) return 0;
    
//     try {
//       let basePrice = parseFloat(item.price.toString().replace(/[^0-9.]/g, '')) || 0;
      
//       if (isGrillItem && selectedSize) {
//         const size = grillSizes.find(s => s.value === selectedSize);
//         if (size) {
//           const calculatedPrice = basePrice * size.multiplier * quantity;
//           return Math.round(calculatedPrice);
//         }
//       }
      
//       const calculatedPrice = basePrice * quantity;
//       return Math.round(calculatedPrice);
//     } catch (error) {
//       console.error("Error calculating price:", error);
//       return 0;
//     }
//   }, [quantity, selectedSize, item, isGrillItem]);

//   // إعادة تعيين القيم عند فتح مودال جديد
//   React.useEffect(() => {
//     if (isOpen && item) {
//       setQuantity(1);
//       setSelectedSize(isGrillItem ? 0.5 : null);
//     }
//   }, [isOpen, item, isGrillItem]);

//   const increaseQuantity = () => {
//     setQuantity(prev => prev + 1);
//   };

//   const decreaseQuantity = () => {
//     if (quantity > 1) {
//       setQuantity(prev => prev - 1);
//     }
//   };

//   const handleAddToCart = () => {
//     if (!item) return;

//     // حساب السعر النهائي بشكل صحيح
//     let finalCalculatedPrice = 0;
//     if (isGrillItem && selectedSize) {
//       const size = grillSizes.find(s => s.value === selectedSize);
//       if (size) {
//         const basePrice = parseFloat(item.price.toString().replace(/[^0-9.]/g, '')) || 0;
//         finalCalculatedPrice = Math.round(basePrice * size.multiplier * quantity);
//       }
//     } else {
//       const basePrice = parseFloat(item.price.toString().replace(/[^0-9.]/g, '')) || 0;
//       finalCalculatedPrice = Math.round(basePrice * quantity);
//     }

//     const itemToAdd = {
//       ...item,
//       quantity: quantity,
//       selectedSize: isGrillItem ? selectedSize : null,
//       displayQuantity: isGrillItem ? 
//         `${grillSizes.find(s => s.value === selectedSize)?.label} × ${quantity}` : 
//         `${quantity} كيلو`,
//       calculatedPrice: finalCalculatedPrice,
//       basePricePerKilo: parseFloat(item.price.toString().replace(/[^0-9.]/g, '')) || 0
//     };

//     onAddToCart(itemToAdd);
    
//     if (playAddToCartSound) {
//       playAddToCartSound();
//     }
    
//     onClose();
//   };

//   const handleSizeSelect = (sizeValue) => {
//     setSelectedSize(sizeValue);
//   };

//   if (!isOpen || !item) return null;

//   const basePrice = parseFloat(item.price.toString().replace(/[^0-9.]/g, '')) || 0;

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 bg-black/70 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
//       onClick={onClose}
//     >
//       <motion.div
//         initial={{ y: '100%' }}
//         animate={{ y: 0 }}
//         exit={{ y: '100%' }}
//         transition={{ type: 'spring', damping: 30 }}
//         className="bg-zinc-900 rounded-t-2xl md:rounded-2xl w-full md:max-w-md max-h-[100vh] md:max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none]"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Image with close button on top */}
//         <div className="relative h-50 overflow-hidden">
//           <Image 
//             src={item.image || "/placeholder-image.jpg"} 
//             alt={item.name || "Bazzom"}
//             width={400}
//             height={256}
//             className="w-full h-full object-cover"
//             onError={(e) => {
//               e.target.src = "/placeholder-image.jpg";
//             }}
//           />
//           {/* Close button on image */}
//           <button 
//             onClick={onClose}
//             className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors text-white backdrop-blur-sm"
//           >
//             <X size={24} />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-6">
//           <div className="flex justify-between items-start mb-4">
//             <div>
//               <h1 className="text-2xl font-bold text-white mb-1">{item.name}</h1>
//               {item.name_en && item.name_en.trim() !== "" && (
//                 <p className="text-white/60">{item.name_en}</p>
//               )}
//             </div>
//             <div className="text-right">
//               <p className="text-2xl font-bold text-[#C49A6C]">{item.price} ج.م</p>
//               {item.original_price && (
//                 <p className="text-white/40 line-through">{item.original_price} ج.م</p>
//               )}
//               {isGrillItem && (
//                 <p className="text-white/60 text-sm mt-1">(سعر الكيلو)</p>
//               )}
//             </div>
//           </div>

//           {item.description && item.description.trim() !== "" && (
//             <div className="mb-6">
//               <p className="text-white/80 leading-relaxed">{item.description}</p>
//             </div>
//           )}

          

//           {/* Quantity Selector & Add to Cart */}
//           <div className="border-t border-zinc-700 pt-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-bold text-white">الكمية</h3>
//               <div className="flex items-center gap-4">
//                 <button 
//                   onClick={decreaseQuantity}
//                   disabled={quantity <= 1}
//                   className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <Minus size={20} />
//                 </button>
//                 <span className="text-xl font-bold w-8 text-center text-white">{quantity}</span>
//                 <button 
//                   onClick={increaseQuantity}
//                   className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors text-white"
//                 >
//                   <Plus size={20} />
//                 </button>
//               </div>
//             </div>

//             <div className="flex justify-between items-center mb-4">
//               <span className="text-white/80">السعر الإجمالي:</span>
//               <span className="text-2xl font-bold text-[#C49A6C]">{price} ج.م</span>
//             </div>

//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={handleAddToCart}
//               className="w-full bg-[#C49A6C] text-black py-4 rounded-xl font-bold text-lg hover:bg-[#B08A5C] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//               disabled={isGrillItem && !selectedSize}
//             >
//               <ShoppingCart size={20} />
//               <span>
//                 {isGrillItem ? (
//                   selectedSize ? (
//                     <>أضف إلى السلة ({grillSizes.find(s => s.value === selectedSize)?.label} × {quantity})</>
//                   ) : (
//                     <>اختر الحجم أولاً</>
//                   )
//                 ) : (
//                   <>أضف إلى السلة ({quantity} )</>
//                 )}
//               </span>
//             </motion.button>
//           </div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default ItemModal;

"use client";
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

const ItemModal = ({ 
  isOpen, 
  onClose, 
  item, 
  onAddToCart,
  playAddToCartSound,
  category = ""
}) => {
  const [quantity, setQuantity] = useState(1);

  // حساب السعر باستخدام useMemo
  const price = useMemo(() => {
    if (!item) return 0;
    
    try {
      const basePrice = parseFloat(item.price.toString().replace(/[^0-9.]/g, '')) || 0;
      const calculatedPrice = basePrice * quantity;
      return Math.round(calculatedPrice);
    } catch (error) {
      console.error("Error calculating price:", error);
      return 0;
    }
  }, [quantity, item]);

  // إعادة تعيين القيم عند فتح مودال جديد
  React.useEffect(() => {
    if (isOpen && item) {
      setQuantity(1);
    }
  }, [isOpen, item]);

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!item) return;

    const basePrice = parseFloat(item.price.toString().replace(/[^0-9.]/g, '')) || 0;
    const finalCalculatedPrice = Math.round(basePrice * quantity);

    const itemToAdd = {
      ...item,
      quantity: quantity,
      displayQuantity: `${quantity}`,
      calculatedPrice: finalCalculatedPrice,
      basePrice: basePrice
    };

    onAddToCart(itemToAdd);
    
    if (playAddToCartSound) {
      playAddToCartSound();
    }
    
    onClose();
  };

  if (!isOpen || !item) return null;

  const basePrice = parseFloat(item.price.toString().replace(/[^0-9.]/g, '')) || 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30 }}
        className="bg-zinc-900 rounded-t-2xl md:rounded-2xl w-full md:max-w-md max-h-[100vh] md:max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image with close button on top */}
        <div className="relative h-50 overflow-hidden">
          <Image 
            src={item.image || "/placeholder-image.jpg"} 
            alt={item.name || "Bazzom"}
            width={400}
            height={256}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/placeholder-image.jpg";
            }}
          />
          {/* Close button on image */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors text-white backdrop-blur-sm"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">{item.name}</h1>
              {item.name_en && item.name_en.trim() !== "" && (
                <p className="text-white/60">{item.name_en}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#C49A6C]">{item.price} ج.م</p>
              {item.original_price && (
                <p className="text-white/40 line-through">{item.original_price} ج.م</p>
              )}
            </div>
          </div>

          {item.description && item.description.trim() !== "" && (
            <div className="mb-6">
              <p className="text-white/80 leading-relaxed">{item.description}</p>
            </div>
          )}

          {/* Quantity Selector & Add to Cart */}
          <div className="border-t border-zinc-700 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">الكمية</h3>
              <div className="flex items-center gap-4">
                <button 
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus size={20} />
                </button>
                <span className="text-xl font-bold w-8 text-center text-white">{quantity}</span>
                <button 
                  onClick={increaseQuantity}
                  className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors text-white"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">السعر الإجمالي:</span>
              <span className="text-2xl font-bold text-[#C49A6C]">{price} ج.م</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="w-full bg-[#C49A6C] text-black py-4 rounded-xl font-bold text-lg hover:bg-[#B08A5C] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={20} />
              <span>أضف إلى السلة ({quantity})</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ItemModal;