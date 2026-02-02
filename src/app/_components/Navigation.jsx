
// "use client";
// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   Menu as MenuIcon, 
//   X, 
//   Users, 
//   MessageSquare, 
//   ChefHat, 
//   Home as HomeIcon, 
//   Utensils, 
//   ShoppingCart,
//   User,
//   LogIn,
//   LogOut,
//   Shield,
//   ChevronDown
// } from 'lucide-react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { useApp } from '../layout-client';
// import Image from 'next/image';
// import { customerApi } from '../_services/customerApi';
// import { authApi } from '../_services/adminApi';

// const Navigation = () => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [accountMenuOpen, setAccountMenuOpen] = useState(false);
//   const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
//   const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
//   const [userRole, setUserRole] = useState('');
//   const [userName, setUserName] = useState('');
//   const pathname = usePathname();
//   const { cart } = useApp();

//   // تحديث حالة المستخدمين
//   const updateUserStatus = () => {
//     const isCustomerAuth = customerApi.isAuthenticated();
//     const isAdminAuth = authApi.isAuthenticated();
//     const currentUserRole = localStorage.getItem("userRole") || '';
    
//     // التحقق إذا كان المستخدم موظفاً
//     const isEmployee = isAdminAuth && ["admin", "cashier", "chief"].includes(currentUserRole);
    
//     if (isEmployee) {
//       // إذا كان موظفاً، لا نعرضه كعميل
//       setIsCustomerLoggedIn(false);
//       setIsAdminLoggedIn(true);
//       setUserRole(currentUserRole);
//       setUserName(authApi.getUserName());
//     } else {
//       // إذا كان عميلاً عادياً
//       setIsCustomerLoggedIn(isCustomerAuth);
//       setIsAdminLoggedIn(isAdminAuth);
//       setUserRole(currentUserRole);
      
//       if (isCustomerAuth) {
//         setUserName(customerApi.getCustomerName());
//       } else if (isAdminAuth) {
//         setUserName(authApi.getUserName());
//       } else {
//         setUserName('');
//       }
//     }
//   };

//   useEffect(() => {
//     updateUserStatus();
    
//     // تحديث عند تغيير المسار
//     const interval = setInterval(updateUserStatus, 1000);
    
//     return () => clearInterval(interval);
//   }, [pathname]);

//   // عناصر التنقل بناءً على الدور
//   const getNavItems = () => {
//     const baseItems = [
//       { key: 'home', label: 'الرئيسية', icon: HomeIcon, path: '/', show: true },
//       { key: 'menu', label: 'القائمة', icon: Utensils, path: '/menu', show: true },
//       { key: 'about', label: 'عن المطعم', icon: Users, path: '/about', show: true },
//       { key: 'reviews', label: 'التقييمات', icon: MessageSquare, path: '/reviews', show: true },
//     ];

//     // عناصر خاصة بالموظفين
//     const employeeItems = [];
    
//     if (isAdminLoggedIn) {
//       if (userRole === "chief") {
//         employeeItems.push({ key: 'kitchen', label: 'المطبخ', icon: ChefHat, path: '/kitchen', show: true });
//       }
      
//       if (userRole === "admin") {
//         employeeItems.push({ key: 'admin', label: 'الإدارة', icon: Shield, path: '/admin/', show: true });
//       }
      
//       if (userRole === "cashier" || userRole === "admin") {
//         employeeItems.push({ key: 'orders', label: 'الطلبات', icon: ShoppingCart, path: '/orders', show: true });
//       }
//     }

//     return [...baseItems, ...employeeItems];
//   };

//   const navItems = getNavItems();

//   const getTotalItems = () => {
//     return cart.reduce((total, item) => total + item.quantity, 0);
//   };

//   const handleCustomerLogout = async () => {
//     try {
//       await customerApi.signOut();
//       updateUserStatus();
//       setAccountMenuOpen(false);
//       window.location.href = '/';
//     } catch (error) {
//       console.error('Customer logout error:', error);
//     }
//   };

//   const handleAdminLogout = async () => {
//     try {
//       await authApi.logout();
//       updateUserStatus();
//       setAccountMenuOpen(false);
//       window.location.href = '/';
//     } catch (error) {
//       console.error('Admin logout error:', error);
//     }
//   };

//   const handleAccountMenuClick = (e) => {
//     e.preventDefault();
    
//     // إذا كان موظفاً، لا نعرض له خيارات العميل
//     if (isAdminLoggedIn && !isCustomerLoggedIn) {
//       setAccountMenuOpen(!accountMenuOpen);
//       return;
//     }
    
//     // إذا كان عميلاً غير مسجل الدخول
//     if (!isCustomerLoggedIn && !isAdminLoggedIn) {
//       localStorage.setItem("redirectAfterAuth", window.location.pathname);
//       window.location.href = '/auth/signin';
//     } else {
//       setAccountMenuOpen(!accountMenuOpen);
//     }
//   };

//   const handleOrdersClick = () => {
//     setAccountMenuOpen(false);
//     setMobileMenuOpen(false);
//     // إضافة scroll إلى قسم الطلبات في الصفحة
//     if (window.location.pathname === '/profile') {
//       window.location.hash = 'orders';
//     } else {
//       window.location.href = '/profile#orders';
//     }
//   };

//   const handleProfileClick = () => {
//     setAccountMenuOpen(false);
//     setMobileMenuOpen(false);
//     window.location.href = '/profile';
//   };

//   return (
//     <nav className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-sm z-50 border-b border-[#C49A6C]/20">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <motion.div 
//             className="flex items-center cursor-pointer"
//             whileHover={{ scale: 1.05 }}
//           >
//             <Link href="/" className="flex items-center gap-3">
//               <Image 
//                 src="/logo.png"
//                 alt="Bazzom Logo"
//                 width={32}
//                 height={32}
//                 className="h-8 w-auto object-contain" 
//               />
//               <div className="block">
//                 <div className="text-lg font-bold text-[#C49A6C]">Bazzom</div>
//                 <div className="text-xs text-white/60">الطعم الأصيل</div>
//               </div>
//             </Link>
//           </motion.div>
          
//           {/* Desktop Menu */}
//           <div className="hidden lg:flex items-center space-x-2 space-x-reverse">
//             {navItems.map(item => (
//               <motion.div
//                 key={item.key}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <Link
//                   href={item.path}
//                   className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
//                     pathname === item.path 
//                       ? 'bg-[#C49A6C] text-black font-semibold' 
//                       : 'text-white hover:text-[#C49A6C] hover:bg-white/5'
//                   }`}
//                 >
//                   <item.icon size={16} />
//                   <span className="font-medium">{item.label}</span>
//                 </Link>
//               </motion.div>
//             ))}

//             {/* Account Button - للعملاء فقط */}
//             {!isAdminLoggedIn && (
//               <div className="relative">
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={handleAccountMenuClick}
//                   className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
//                     pathname.startsWith('/auth') || pathname.startsWith('/profile')
//                       ? 'bg-[#C49A6C] text-black font-semibold' 
//                       : 'text-white hover:text-[#C49A6C] hover:bg-white/5'
//                   }`}
//                 >
//                   {isCustomerLoggedIn ? (
//                     <>
//                       <User size={16} />
//                       <span className="font-medium">حسابي</span>
//                       <ChevronDown className={`w-3 h-3 transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`} />
//                     </>
//                   ) : (
//                     <>
//                       <LogIn size={16} />
//                       <span className="font-medium">تسجيل الدخول</span>
//                     </>
//                   )}
//                 </motion.button>

//                 {/* Account Dropdown Menu - للعملاء فقط */}
//                 <AnimatePresence>
//                   {isCustomerLoggedIn && accountMenuOpen && (
//                     <motion.div
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       className="absolute left-0 mt-2 w-48 bg-zinc-900 rounded-lg shadow-lg border border-[#C49A6C]/20"
//                     >
//                       <div className="py-2">
//                         <button
//                           onClick={handleProfileClick}
//                           className="flex items-center gap-2 w-full px-4 py-2 text-white hover:bg-white/5 transition-all text-right"
//                         >
//                           <User size={16} />
//                           <span>حسابي</span>
//                         </button>
//                         <button
//                           onClick={handleOrdersClick}
//                           className="flex items-center gap-2 w-full px-4 py-2 text-white hover:bg-white/5 transition-all text-right"
//                         >
//                           <ShoppingCart size={16} />
//                           <span>طلباتي</span>
//                         </button>
                        
//                         <div className="border-t border-white/10 my-1"></div>
                        
//                         <button
//                           onClick={handleCustomerLogout}
//                           className="flex items-center gap-2 w-full px-4 py-2 text-red-400 hover:bg-red-500/10 transition-all text-right"
//                         >
//                           <LogOut size={16} />
//                           <span>تسجيل الخروج</span>
//                         </button>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             )}

//             {/* Employee Account Button - للموظفين فقط */}
//             {isAdminLoggedIn && (
//               <div className="relative">
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => setAccountMenuOpen(!accountMenuOpen)}
//                   className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
//                     'bg-[#C49A6C]/20 text-[#C49A6C] hover:bg-[#C49A6C]/30'
//                   }`}
//                 >
//                   <Shield size={16} />
//                   <span className="font-medium">
//                     {userRole === "admin" ? "مدير" : 
//                      userRole === "cashier" ? "كاشير" : 
//                      userRole === "chief" ? "شيف" : "موظف"}
//                   </span>
//                   <ChevronDown className={`w-3 h-3 transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`} />
//                 </motion.button>

//                 {/* Employee Dropdown Menu */}
//                 <AnimatePresence>
//                   {isAdminLoggedIn && accountMenuOpen && (
//                     <motion.div
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       className="absolute left-0 mt-2 w-48 bg-zinc-900 rounded-lg shadow-lg border border-[#C49A6C]/20"
//                     >
//                       <div className="py-2">
//                         <div className="px-4 py-2 text-white/60 text-sm border-b border-white/10">
//                           <div>{userName}</div>
//                           <div className="text-xs">
//                             {userRole === "admin" ? "مدير النظام" : 
//                              userRole === "cashier" ? "كاشير" : 
//                              userRole === "chief" ? "شيف المطبخ" : "موظف"}
//                           </div>
//                         </div>
                        
//                         {userRole === "admin" && (
//                           <Link
//                             href="/admin/"
//                             className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/5 transition-all"
//                             onClick={() => setAccountMenuOpen(false)}
//                           >
//                             <HomeIcon size={16} />
//                             <span>لوحة التحكم</span>
//                           </Link>
//                         )}
                        
//                         {(userRole === "cashier" || userRole === "admin") && (
//                           <Link
//                             href="/orders"
//                             className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/5 transition-all"
//                             onClick={() => setAccountMenuOpen(false)}
//                           >
//                             <ShoppingCart size={16} />
//                             <span>الطلبات</span>
//                           </Link>
//                         )}
                        
//                         {(userRole === "chief" || userRole === "admin") && (
//                           <Link
//                             href="/kitchen"
//                             className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/5 transition-all"
//                             onClick={() => setAccountMenuOpen(false)}
//                           >
//                             <ChefHat size={16} />
//                             <span>المطبخ</span>
//                           </Link>
//                         )}
                        
//                         <div className="border-t border-white/10 my-1"></div>
                        
//                         <button
//                           onClick={handleAdminLogout}
//                           className="flex items-center gap-2 w-full px-4 py-2 text-red-400 hover:bg-red-500/10 transition-all text-right"
//                         >
//                           <LogOut size={16} />
//                           <span>تسجيل الخروج</span>
//                         </button>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             )}

//             {/* Cart Button */}
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <Link
//                 href="/cart"
//                 className={`relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
//                   pathname === '/cart'
//                     ? 'bg-[#C49A6C] text-black font-semibold'
//                     : 'text-white hover:text-[#C49A6C] hover:bg-white/5'
//                 }`}
//               >
//                 <ShoppingCart size={16} />
//                 <span className="font-medium">السلة</span>
//                 {cart.length > 0 && (
//                   <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold border border-black text-[10px]">
//                     {getTotalItems()}
//                   </span>
//                 )}
//               </Link>
//             </motion.div>
//           </div>

//           {/* Mobile Menu */}
//           <div className="flex items-center gap-2 lg:hidden">
//             {/* Cart Button - Mobile */}
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <Link
//                 href="/cart"
//                 className="relative flex items-center p-2 text-white hover:text-[#C49A6C] transition-all rounded-lg hover:bg-white/5"
//               >
//                 <ShoppingCart size={20} />
//                 {cart.length > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold border border-black text-[10px]">
//                     {getTotalItems()}
//                   </span>
//                 )}
//               </Link>
//             </motion.div>

//             {/* Account Button - Mobile */}
//             {(!isAdminLoggedIn || isCustomerLoggedIn) && (
//               <div className="relative">
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={handleAccountMenuClick}
//                   className="p-2 text-white hover:text-[#C49A6C] transition-all rounded-lg hover:bg-white/5"
//                 >
//                   {isCustomerLoggedIn || isAdminLoggedIn ? (
//                     <User size={20} />
//                   ) : (
//                     <LogIn size={20} />
//                   )}
//                 </motion.button>

//                 {/* Account Dropdown Menu - Mobile */}
//                 <AnimatePresence>
//                   {isCustomerLoggedIn && accountMenuOpen && (
//                     <motion.div
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       className="absolute left-0 mt-2 w-48 bg-zinc-900 rounded-lg shadow-lg border border-[#C49A6C]/20 z-50"
//                     >
//                       <div className="py-2">
//                         <button
//                           onClick={handleProfileClick}
//                           className="flex items-center gap-2 w-full px-4 py-2 text-white hover:bg-white/5 transition-all text-right"
//                         >
//                           <User size={16} />
//                           <span>حسابي</span>
//                         </button>
//                         <button
//                           onClick={handleOrdersClick}
//                           className="flex items-center gap-2 w-full px-4 py-2 text-white hover:bg-white/5 transition-all text-right"
//                         >
//                           <ShoppingCart size={16} />
//                           <span>طلباتي</span>
//                         </button>
                        
//                         <div className="border-t border-white/10 my-1"></div>
                        
//                         <button
//                           onClick={handleCustomerLogout}
//                           className="flex items-center gap-2 w-full px-4 py-2 text-red-400 hover:bg-red-500/10 transition-all text-right"
//                         >
//                           <LogOut size={16} />
//                           <span>تسجيل الخروج</span>
//                         </button>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             )}

//             {/* Employee Account Button - Mobile للموظفين فقط */}
//             {isAdminLoggedIn && !isCustomerLoggedIn && (
//               <div className="relative">
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => setAccountMenuOpen(!accountMenuOpen)}
//                   className="p-2 text-[#C49A6C] hover:text-[#C49A6C]/80 transition-all rounded-lg hover:bg-white/5"
//                 >
//                   <Shield size={20} />
//                 </motion.button>

//                 {/* Employee Dropdown Menu - Mobile */}
//                 <AnimatePresence>
//                   {isAdminLoggedIn && !isCustomerLoggedIn && accountMenuOpen && (
//                     <motion.div
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       className="absolute left-0 mt-2 w-48 bg-zinc-900 rounded-lg shadow-lg border border-[#C49A6C]/20 z-50"
//                     >
//                       <div className="py-2">
//                         <div className="px-4 py-2 text-white/60 text-sm border-b border-white/10">
//                           <div>{userName}</div>
//                           <div className="text-xs">
//                             {userRole === "admin" ? "مدير النظام" : 
//                              userRole === "cashier" ? "كاشير" : 
//                              userRole === "chief" ? "شيف المطبخ" : "موظف"}
//                           </div>
//                         </div>
                        
//                         {userRole === "admin" && (
//                           <Link
//                             href="/admin/"
//                             className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/5 transition-all"
//                             onClick={() => setAccountMenuOpen(false)}
//                           >
//                             <HomeIcon size={16} />
//                             <span>لوحة التحكم</span>
//                           </Link>
//                         )}
                        
//                         {(userRole === "cashier" || userRole === "admin") && (
//                           <Link
//                             href="/orders"
//                             className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/5 transition-all"
//                             onClick={() => setAccountMenuOpen(false)}
//                           >
//                             <ShoppingCart size={16} />
//                             <span>الطلبات</span>
//                           </Link>
//                         )}
                        
//                         {(userRole === "chief" || userRole === "admin") && (
//                           <Link
//                             href="/kitchen"
//                             className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/5 transition-all"
//                             onClick={() => setAccountMenuOpen(false)}
//                           >
//                             <ChefHat size={16} />
//                             <span>المطبخ</span>
//                           </Link>
//                         )}
                        
//                         <div className="border-t border-white/10 my-1"></div>
                        
//                         <button
//                           onClick={handleAdminLogout}
//                           className="flex items-center gap-2 w-full px-4 py-2 text-red-400 hover:bg-red-500/10 transition-all text-right"
//                         >
//                           <LogOut size={16} />
//                           <span>تسجيل الخروج</span>
//                         </button>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             )}

//             {/* Menu Toggle */}
//             <motion.button 
//               className="text-white p-2 rounded-lg hover:bg-white/5 transition-all"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             >
//               {mobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
//             </motion.button>
//           </div>
//         </div>

//         {/* Mobile Menu Panel */}
//         <AnimatePresence>
//           {mobileMenuOpen && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//               className="lg:hidden pb-3 bg-black/95 backdrop-blur-sm rounded-lg mt-2 border border-[#C49A6C]/20"
//               onClick={() => setMobileMenuOpen(false)}
//             >
//               <div className="space-y-1 p-2">
//                 {navItems.map(item => (
//                   <motion.div
//                     key={item.key}
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     <Link
//                       href={item.path}
//                       className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
//                         pathname === item.path 
//                           ? 'bg-[#C49A6C] text-black font-semibold' 
//                           : 'text-white hover:bg-white/10'
//                       }`}
//                       onClick={() => setMobileMenuOpen(false)}
//                     >
//                       <item.icon size={18} />
//                       <span className="font-medium">{item.label}</span>
//                     </Link>
//                   </motion.div>
//                 ))}
                
//                 {/* Cart Button in Mobile Menu */}
//                 <motion.div
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                 >
//                   <Link
//                     href="/cart"
//                     className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
//                       pathname === '/cart' 
//                         ? 'bg-[#C49A6C] text-black font-semibold' 
//                         : 'text-white hover:bg-white/10'
//                     }`}
//                     onClick={() => setMobileMenuOpen(false)}
//                   >
//                     <ShoppingCart size={18} />
//                     <span className="font-medium">السلة</span>
//                     {cart.length > 0 && (
//                       <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold mr-auto text-[10px]">
//                         {getTotalItems()}
//                       </span>
//                     )}
//                   </Link>
//                 </motion.div>

//                 {/* User Section in Mobile Menu */}
//                 <div className="pt-2 border-t border-white/10">
//                   {isCustomerLoggedIn ? (
//                     <>
//                       <motion.div
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                       >
//                         <button
//                           onClick={handleProfileClick}
//                           className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm text-white hover:bg-white/10 text-right"
//                         >
//                           <User size={18} />
//                           <span className="font-medium">حسابي</span>
//                         </button>
//                       </motion.div>
//                       <motion.div
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                       >
//                         <button
//                           onClick={handleOrdersClick}
//                           className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm text-white hover:bg-white/10 text-right"
//                         >
//                           <ShoppingCart size={18} />
//                           <span className="font-medium">طلباتي</span>
//                         </button>
//                       </motion.div>
//                       <motion.div
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                       >
//                         <button
//                           onClick={handleCustomerLogout}
//                           className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm text-red-400 hover:bg-red-500/10 text-right"
//                         >
//                           <LogOut size={18} />
//                           <span className="font-medium">تسجيل الخروج</span>
//                         </button>
//                       </motion.div>
//                     </>
//                   ) : isAdminLoggedIn ? (
//                     <>
//                       <div className="px-3 py-2 text-white/60 text-sm">
//                         <div>{userName}</div>
//                         <div className="text-xs">
//                           {userRole === "admin" ? "مدير النظام" : 
//                            userRole === "cashier" ? "كاشير" : 
//                            userRole === "chief" ? "شيف المطبخ" : "موظف"}
//                         </div>
//                       </div>
                      
//                       {userRole === "admin" && (
//                         <motion.div
//                           whileHover={{ scale: 1.02 }}
//                           whileTap={{ scale: 0.98 }}
//                         >
//                           <Link
//                             href="/admin/"
//                             className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm text-white hover:bg-white/10"
//                             onClick={() => setMobileMenuOpen(false)}
//                           >
//                             <HomeIcon size={18} />
//                             <span className="font-medium">لوحة التحكم</span>
//                           </Link>
//                         </motion.div>
//                       )}
                      
//                       {(userRole === "cashier" || userRole === "admin") && (
//                         <motion.div
//                           whileHover={{ scale: 1.02 }}
//                           whileTap={{ scale: 0.98 }}
//                         >
//                           <Link
//                             href="/orders"
//                             className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm text-white hover:bg-white/10"
//                             onClick={() => setMobileMenuOpen(false)}
//                           >
//                             <ShoppingCart size={18} />
//                             <span className="font-medium">الطلبات</span>
//                           </Link>
//                         </motion.div>
//                       )}
                      
//                       {(userRole === "chief" || userRole === "admin") && (
//                         <motion.div
//                           whileHover={{ scale: 1.02 }}
//                           whileTap={{ scale: 0.98 }}
//                         >
//                           <Link
//                             href="/kitchen"
//                             className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm text-white hover:bg-white/10"
//                             onClick={() => setMobileMenuOpen(false)}
//                           >
//                             <ChefHat size={18} />
//                             <span className="font-medium">المطبخ</span>
//                           </Link>
//                         </motion.div>
//                       )}
                      
//                       <motion.div
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                       >
//                         <button
//                           onClick={handleAdminLogout}
//                           className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm text-red-400 hover:bg-red-500/10 text-right"
//                         >
//                           <LogOut size={18} />
//                           <span className="font-medium">تسجيل الخروج</span>
//                         </button>
//                       </motion.div>
//                     </>
//                   ) : (
//                     <motion.div
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                     >
//                       <Link
//                         href="/auth/signin"
//                         className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm text-[#C49A6C] hover:bg-[#C49A6C]/10"
//                         onClick={() => setMobileMenuOpen(false)}
//                       >
//                         <LogIn size={18} />
//                         <span className="font-medium">تسجيل الدخول</span>
//                       </Link>
//                     </motion.div>
//                   )}
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </nav>
//   );
// };

// export default Navigation;


"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu as MenuIcon, 
  X, 
  Users, 
  MessageSquare, 
  ChefHat, 
  Home as HomeIcon, 
  Utensils, 
  ShoppingCart,
  User,
  LogIn,
  LogOut,
  Shield,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../layout-client';
import Image from 'next/image';
import { customerApi } from '../_services/customerApi';
import { authApi } from '../_services/adminApi';
import { supabase } from '../_services/supabase';

const CUSTOMER_STORAGE_KEY = "bazzom_customer";

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');
  const pathname = usePathname();
  const { cart } = useApp();

  // تحديث حالة المستخدمين
  const updateUserStatus = async () => {
    try {
      console.log("🔄 تحديث حالة المستخدم...");
      
      // الحصول على الجلسة الحالية
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        console.log("⚠️ لا توجد جلسة نشطة");
        setIsCustomerLoggedIn(false);
        setIsAdminLoggedIn(false);
        setUserRole('');
        setUserName('');
        return;
      }

      const userId = sessionData.session.user.id;
      const userEmail = sessionData.session.user.email;

      console.log("✅ جلسة موجودة للمستخدم:", { userId, userEmail });

      // التحقق أولاً إذا كان موظفاً
      try {
        const { data: userProfile, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (userProfile && !profileError) {
          console.log("👨‍💼 المستخدم موظف:", userProfile);
          
          // مستخدم موظف
          setIsCustomerLoggedIn(false);
          setIsAdminLoggedIn(true);
          setUserRole(userProfile.role);
          setUserName(userProfile.name || userEmail);

          // تحديث localStorage للموظف
          localStorage.setItem("userRole", userProfile.role);
          localStorage.setItem("userId", userId);
          localStorage.setItem("userName", userProfile.name || userEmail);
          localStorage.setItem("adminAuthenticated", "true");
          localStorage.setItem("userEmail", userEmail);
          
          // تنظيف بيانات العميل
          localStorage.removeItem("customerAuthenticated");
          localStorage.removeItem("customerId");
          localStorage.removeItem(CUSTOMER_STORAGE_KEY);
          
          console.log("✅ تم تحديث بيانات الموظف");
          return;
        }
      } catch (profileError) {
        console.log("ℹ️ المستخدم ليس موظفاً");
      }

      // التحقق إذا كان عميلاً
      try {
        const { data: customer, error: customerError } = await supabase
          .from("customers")
          .select("*")
          .eq("id", userId)
          .single();

        if (customer && !customerError) {
          console.log("👤 المستخدم عميل:", customer);
          
          // مستخدم عميل
          setIsCustomerLoggedIn(true);
          setIsAdminLoggedIn(false);
          setUserRole('customer');
          setUserName(customer.name || customer.email);

          // تحديث localStorage للعميل
          const customerData = {
            id: customer.id,
            email: customer.email,
            name: customer.name,
            phone: customer.phone || "",
            addresses: customer.addresses || [],
          };
          
          localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customerData));
          localStorage.setItem("customerAuthenticated", "true");
          localStorage.setItem("customerId", customer.id);
          localStorage.setItem("userName", customer.name || customer.email);
          
          // تنظيف بيانات الموظف
          localStorage.removeItem("adminAuthenticated");
          localStorage.removeItem("userRole");
          localStorage.removeItem("userEmail");
          localStorage.removeItem("userId");
          
          console.log("✅ تم تحديث بيانات العميل");
          return;
        }
      } catch (customerError) {
        console.log("ℹ️ المستخدم ليس عميلاً");
      }

      // إذا لم يكن أي من النوعين
      console.log("👻 المستخدم ليس موظفاً ولا عميلاً");
      setIsCustomerLoggedIn(false);
      setIsAdminLoggedIn(false);
      setUserRole('');
      setUserName('');
      
      // تنظيف جميع البيانات
      localStorage.removeItem("adminAuthenticated");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("customerAuthenticated");
      localStorage.removeItem("customerId");
      localStorage.removeItem(CUSTOMER_STORAGE_KEY);
      
    } catch (error) {
      console.error("❌ خطأ في تحديث حالة المستخدم:", error);
      
      // في حالة الخطأ، التحقق من localStorage
      const adminAuth = localStorage.getItem("adminAuthenticated");
      const customerAuth = localStorage.getItem("customerAuthenticated");
      const storedRole = localStorage.getItem("userRole");
      
      if (adminAuth && ["admin", "cashier", "chief"].includes(storedRole)) {
        setIsAdminLoggedIn(true);
        setIsCustomerLoggedIn(false);
        setUserRole(storedRole);
        setUserName(localStorage.getItem("userName") || "موظف");
      } else if (customerAuth) {
        setIsCustomerLoggedIn(true);
        setIsAdminLoggedIn(false);
        setUserRole('customer');
        try {
          const customer = JSON.parse(localStorage.getItem(CUSTOMER_STORAGE_KEY) || "{}");
          setUserName(customer.name || "عميل");
        } catch {
          setUserName("عميل");
        }
      } else {
        setIsCustomerLoggedIn(false);
        setIsAdminLoggedIn(false);
        setUserRole('');
        setUserName('');
      }
    }
  };

  useEffect(() => {
    updateUserStatus();
    
    // إضافة مستمع لتغيير الجلسة
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("🔐 تغيير حالة المصادقة:", event);
        updateUserStatus();
      }
    );
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [pathname]);

  // عناصر التنقل بناءً على الدور
  const getNavItems = () => {
    const baseItems = [
      { key: 'home', label: 'الرئيسية', icon: HomeIcon, path: '/', show: true },
      { key: 'menu', label: 'القائمة', icon: Utensils, path: '/menu', show: true },
      { key: 'about', label: 'عن المطعم', icon: Users, path: '/about', show: true },
      { key: 'reviews', label: 'التقييمات', icon: MessageSquare, path: '/reviews', show: true },
    ];

    // عناصر خاصة بالموظفين فقط (لا تظهر للعملاء)
    const employeeItems = [];
    
    if (isAdminLoggedIn && !isCustomerLoggedIn) {
      if (userRole === "chief") {
        employeeItems.push({ key: 'kitchen', label: 'المطبخ', icon: ChefHat, path: '/kitchen', show: true });
      }
      
      if (userRole === "admin") {
        employeeItems.push({ key: 'admin', label: 'الإدارة', icon: Shield, path: '/admin/', show: true });
      }
      
      if (userRole === "cashier" || userRole === "admin") {
        employeeItems.push({ key: 'orders', label: 'الطلبات', icon: ShoppingCart, path: '/orders', show: true });
      }
    }

    return [...baseItems, ...employeeItems];
  };

  const navItems = getNavItems();

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCustomerLogout = async () => {
    try {
      await customerApi.signOut();
      await updateUserStatus();
      setAccountMenuOpen(false);
      setMobileMenuOpen(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Customer logout error:', error);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await authApi.logout();
      await updateUserStatus();
      setAccountMenuOpen(false);
      setMobileMenuOpen(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Admin logout error:', error);
    }
  };

  const handleAccountMenuClick = (e) => {
    e.preventDefault();
    
    // إذا كان موظفاً، يعرض قائمة الموظفين فقط
    if (isAdminLoggedIn && !isCustomerLoggedIn) {
      setAccountMenuOpen(!accountMenuOpen);
      return;
    }
    
    // إذا كان عميلاً غير مسجل الدخول
    if (!isCustomerLoggedIn && !isAdminLoggedIn) {
      localStorage.setItem("redirectAfterAuth", window.location.pathname);
      window.location.href = '/auth/signin';
    } else {
      setAccountMenuOpen(!accountMenuOpen);
    }
  };

  const handleOrdersClick = () => {
    setAccountMenuOpen(false);
    setMobileMenuOpen(false);
    // إضافة scroll إلى قسم الطلبات في الصفحة
    if (window.location.pathname === '/profile') {
      window.location.hash = 'orders';
    } else {
      window.location.href = '/profile#orders';
    }
  };

  const handleProfileClick = () => {
    setAccountMenuOpen(false);
    setMobileMenuOpen(false);
    window.location.href = '/profile';
  };

  // منع الموظفين من الوصول لصفحات العملاء
  const handleCustomerNavigation = (e, path) => {
    if (isAdminLoggedIn && !isCustomerLoggedIn) {
      e.preventDefault();
      alert("⛔ غير مصرح للموظفين بالوصول إلى صفحات العملاء");
      return;
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-sm z-50 border-b border-[#C49A6C]/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/logo.png"
                alt="Bazzom Logo"
                width={32}
                height={32}
                className="h-8 w-auto object-contain" 
              />
              <div className="block">
                <div className="text-lg font-bold text-[#C49A6C]">Bazzom</div>
                <div className="text-xs text-white/60">الطعم الأصيل</div>
              </div>
            </Link>
          </motion.div>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-2 space-x-reverse">
            {navItems.map(item => (
              <motion.div
                key={item.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.path}
                  onClick={(e) => {
                    if ((item.path === '/profile' || item.path.startsWith('/auth')) && isAdminLoggedIn && !isCustomerLoggedIn) {
                      e.preventDefault();
                      alert("⛔ غير مصرح للموظفين بالوصول إلى صفحات العملاء");
                    }
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                    pathname === item.path 
                      ? 'bg-[#C49A6C] text-black font-semibold' 
                      : 'text-white hover:text-[#C49A6C] hover:bg-white/5'
                  }`}
                >
                  <item.icon size={16} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </motion.div>
            ))}

            {/* Account Button - للعملاء فقط */}
            {!isAdminLoggedIn && (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAccountMenuClick}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                    pathname.startsWith('/auth') || pathname.startsWith('/profile')
                      ? 'bg-[#C49A6C] text-black font-semibold' 
                      : 'text-white hover:text-[#C49A6C] hover:bg-white/5'
                  }`}
                >
                  {isCustomerLoggedIn ? (
                    <>
                      <User size={16} />
                      <span className="font-medium">حسابي</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`} />
                    </>
                  ) : (
                    <>
                      <LogIn size={16} />
                      <span className="font-medium">تسجيل الدخول</span>
                    </>
                  )}
                </motion.button>

                {/* Account Dropdown Menu - للعملاء فقط */}
                <AnimatePresence>
                  {isCustomerLoggedIn && accountMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 mt-2 w-48 bg-zinc-900 rounded-lg shadow-lg border border-[#C49A6C]/20"
                    >
                      <div className="py-2">
                        <button
                          onClick={handleProfileClick}
                          className="flex items-center gap-2 w-full px-4 py-2 text-white hover:bg-white/5 transition-all text-right"
                        >
                          <User size={16} />
                          <span>حسابي</span>
                        </button>
                        <button
                          onClick={handleOrdersClick}
                          className="flex items-center gap-2 w-full px-4 py-2 text-white hover:bg-white/5 transition-all text-right"
                        >
                          <ShoppingCart size={16} />
                          <span>طلباتي</span>
                        </button>
                        
                        <div className="border-t border-white/10 my-1"></div>
                        
                        <button
                          onClick={handleCustomerLogout}
                          className="flex items-center gap-2 w-full px-4 py-2 text-red-400 hover:bg-red-500/10 transition-all text-right"
                        >
                          <LogOut size={16} />
                          <span>تسجيل الخروج</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Employee Account Button - للموظفين فقط */}
            {isAdminLoggedIn && !isCustomerLoggedIn && (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                    'bg-[#C49A6C]/20 text-[#C49A6C] hover:bg-[#C49A6C]/30'
                  }`}
                >
                  <Shield size={16} />
                  <span className="font-medium">
                    {userRole === "admin" ? "مدير" : 
                     userRole === "cashier" ? "كاشير" : 
                     userRole === "chief" ? "شيف" : "موظف"}
                  </span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* Employee Dropdown Menu */}
                <AnimatePresence>
                  {isAdminLoggedIn && !isCustomerLoggedIn && accountMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 mt-2 w-48 bg-zinc-900 rounded-lg shadow-lg border border-[#C49A6C]/20"
                    >
                      <div className="py-2">
                        <div className="px-4 py-2 text-white/60 text-sm border-b border-white/10">
                          <div>{userName}</div>
                          <div className="text-xs">
                            {userRole === "admin" ? "مدير النظام" : 
                             userRole === "cashier" ? "كاشير" : 
                             userRole === "chief" ? "شيف المطبخ" : "موظف"}
                          </div>
                        </div>
                        
                        {userRole === "admin" && (
                          <Link
                            href="/admin/"
                            className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/5 transition-all"
                            onClick={() => setAccountMenuOpen(false)}
                          >
                            <HomeIcon size={16} />
                            <span>لوحة التحكم</span>
                          </Link>
                        )}
                        
                        {(userRole === "cashier" || userRole === "admin") && (
                          <Link
                            href="/orders"
                            className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/5 transition-all"
                            onClick={() => setAccountMenuOpen(false)}
                          >
                            <ShoppingCart size={16} />
                            <span>الطلبات</span>
                          </Link>
                        )}
                        
                        {(userRole === "chief" || userRole === "admin") && (
                          <Link
                            href="/kitchen"
                            className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/5 transition-all"
                            onClick={() => setAccountMenuOpen(false)}
                          >
                            <ChefHat size={16} />
                            <span>المطبخ</span>
                          </Link>
                        )}
                        
                        <div className="border-t border-white/10 my-1"></div>
                        
                        <button
                          onClick={handleAdminLogout}
                          className="flex items-center gap-2 w-full px-4 py-2 text-red-400 hover:bg-red-500/10 transition-all text-right"
                        >
                          <LogOut size={16} />
                          <span>تسجيل الخروج</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Cart Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/cart"
                onClick={(e) => {
                  if (isAdminLoggedIn && !isCustomerLoggedIn) {
                    e.preventDefault();
                    alert("⛔ غير مصرح للموظفين بالوصول إلى سلة التسوق");
                  }
                }}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                  pathname === '/cart'
                    ? 'bg-[#C49A6C] text-black font-semibold'
                    : 'text-white hover:text-[#C49A6C] hover:bg-white/5'
                }`}
              >
                <ShoppingCart size={16} />
                <span className="font-medium">السلة</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold border border-black text-[10px]">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Cart Button - Mobile */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/cart"
                onClick={(e) => {
                  if (isAdminLoggedIn && !isCustomerLoggedIn) {
                    e.preventDefault();
                    alert("⛔ غير مصرح للموظفين بالوصول إلى سلة التسوق");
                  }
                }}
                className="relative flex items-center p-2 text-white hover:text-[#C49A6C] transition-all rounded-lg hover:bg-white/5"
              >
                <ShoppingCart size={20} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold border border-black text-[10px]">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            </motion.div>

            {/* Account Button - Mobile */}
            {!isAdminLoggedIn && (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAccountMenuClick}
                  className="p-2 text-white hover:text-[#C49A6C] transition-all rounded-lg hover:bg-white/5"
                >
                  {isCustomerLoggedIn ? (
                    <User size={20} />
                  ) : (
                    <LogIn size={20} />
                  )}
                </motion.button>

                {/* Account Dropdown Menu - Mobile */}
                <AnimatePresence>
                  {isCustomerLoggedIn && accountMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 mt-2 w-48 bg-zinc-900 rounded-lg shadow-lg border border-[#C49A6C]/20 z-50"
                    >
                      <div className="py-2">
                        <button
                          onClick={handleProfileClick}
                          className="flex items-center gap-2 w-full px-4 py-2 text-white hover:bg-white/5 transition-all text-right"
                        >
                          <User size={16} />
                          <span>حسابي</span>
                        </button>
                        <button
                          onClick={handleOrdersClick}
                          className="flex items-center gap-2 w-full px-4 py-2 text-white hover:bg-white/5 transition-all text-right"
                        >
                          <ShoppingCart size={16} />
                          <span>طلباتي</span>
                        </button>
                        
                        <div className="border-t border-white/10 my-1"></div>
                        
                        <button
                          onClick={handleCustomerLogout}
                          className="flex items-center gap-2 w-full px-4 py-2 text-red-400 hover:bg-red-500/10 transition-all text-right"
                        >
                          <LogOut size={16} />
                          <span>تسجيل الخروج</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Employee Account Button - Mobile للموظفين فقط */}
            {isAdminLoggedIn && !isCustomerLoggedIn && (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="p-2 text-[#C49A6C] hover:text-[#C49A6C]/80 transition-all rounded-lg hover:bg-white/5"
                >
                  <Shield size={20} />
                </motion.button>

                {/* Employee Dropdown Menu - Mobile */}
                <AnimatePresence>
                  {isAdminLoggedIn && !isCustomerLoggedIn && accountMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 mt-2 w-48 bg-zinc-900 rounded-lg shadow-lg border border-[#C49A6C]/20 z-50"
                    >
                      <div className="py-2">
                        <div className="px-4 py-2 text-white/60 text-sm border-b border-white/10">
                          <div>{userName}</div>
                          <div className="text-xs">
                            {userRole === "admin" ? "مدير النظام" : 
                             userRole === "cashier" ? "كاشير" : 
                             userRole === "chief" ? "شيف المطبخ" : "موظف"}
                          </div>
                        </div>
                        
                        {userRole === "admin" && (
                          <Link
                            href="/admin/"
                            className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/5 transition-all"
                            onClick={() => {
                              setAccountMenuOpen(false);
                              setMobileMenuOpen(false);
                            }}
                          >
                            <HomeIcon size={16} />
                            <span>لوحة التحكم</span>
                          </Link>
                        )}
                        
                        {(userRole === "cashier" || userRole === "admin") && (
                          <Link
                            href="/orders"
                            className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/5 transition-all"
                            onClick={() => {
                              setAccountMenuOpen(false);
                              setMobileMenuOpen(false);
                            }}
                          >
                            <ShoppingCart size={16} />
                            <span>الطلبات</span>
                          </Link>
                        )}
                        
                        {(userRole === "chief" || userRole === "admin") && (
                          <Link
                            href="/kitchen"
                            className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/5 transition-all"
                            onClick={() => {
                              setAccountMenuOpen(false);
                              setMobileMenuOpen(false);
                            }}
                          >
                            <ChefHat size={16} />
                            <span>المطبخ</span>
                          </Link>
                        )}
                        
                        <div className="border-t border-white/10 my-1"></div>
                        
                        <button
                          onClick={handleAdminLogout}
                          className="flex items-center gap-2 w-full px-4 py-2 text-red-400 hover:bg-red-500/10 transition-all text-right"
                        >
                          <LogOut size={16} />
                          <span>تسجيل الخروج</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Menu Toggle */}
            <motion.button 
              className="text-white p-2 rounded-lg hover:bg-white/5 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden pb-3 bg-black/95 backdrop-blur-sm rounded-lg mt-2 border border-[#C49A6C]/20"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="space-y-1 p-2">
                {navItems.map(item => (
                  <motion.div
                    key={item.key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={item.path}
                      onClick={(e) => {
                        if ((item.path === '/profile' || item.path.startsWith('/auth')) && isAdminLoggedIn && !isCustomerLoggedIn) {
                          e.preventDefault();
                          alert("⛔ غير مصرح للموظفين بالوصول إلى صفحات العملاء");
                          setMobileMenuOpen(false);
                        } else {
                          setMobileMenuOpen(false);
                        }
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                        pathname === item.path 
                          ? 'bg-[#C49A6C] text-black font-semibold' 
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      <item.icon size={18} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
                
                {/* Cart Button in Mobile Menu */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href="/cart"
                    onClick={(e) => {
                      if (isAdminLoggedIn && !isCustomerLoggedIn) {
                        e.preventDefault();
                        alert("⛔ غير مصرح للموظفين بالوصول إلى سلة التسوق");
                        setMobileMenuOpen(false);
                      } else {
                        setMobileMenuOpen(false);
                      }
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                      pathname === '/cart' 
                        ? 'bg-[#C49A6C] text-black font-semibold' 
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <ShoppingCart size={18} />
                    <span className="font-medium">السلة</span>
                    {cart.length > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold mr-auto text-[10px]">
                        {getTotalItems()}
                      </span>
                    )}
                  </Link>
                </motion.div>

                {/* User Section in Mobile Menu */}
                <div className="pt-2 border-t border-white/10">
                  {isCustomerLoggedIn ? (
                    <>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <button
                          onClick={handleProfileClick}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm text-white hover:bg-white/10 text-right"
                        >
                          <User size={18} />
                          <span className="font-medium">حسابي</span>
                        </button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <button
                          onClick={handleOrdersClick}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm text-white hover:bg-white/10 text-right"
                        >
                          <ShoppingCart size={18} />
                          <span className="font-medium">طلباتي</span>
                        </button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <button
                          onClick={handleCustomerLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm text-red-400 hover:bg-red-500/10 text-right"
                        >
                          <LogOut size={18} />
                          <span className="font-medium">تسجيل الخروج</span>
                        </button>
                      </motion.div>
                    </>
                  ) : isAdminLoggedIn ? (
                    <>
                      <div className="px-3 py-2 text-white/60 text-sm">
                        <div>{userName}</div>
                        <div className="text-xs">
                          {userRole === "admin" ? "مدير النظام" : 
                           userRole === "cashier" ? "كاشير" : 
                           userRole === "chief" ? "شيف المطبخ" : "موظف"}
                        </div>
                      </div>
                      
                      {userRole === "admin" && (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link
                            href="/admin/"
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm text-white hover:bg-white/10"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <HomeIcon size={18} />
                            <span className="font-medium">لوحة التحكم</span>
                          </Link>
                        </motion.div>
                      )}
                      
                      {(userRole === "cashier" || userRole === "admin") && (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link
                            href="/orders"
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm text-white hover:bg-white/10"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <ShoppingCart size={18} />
                            <span className="font-medium">الطلبات</span>
                          </Link>
                        </motion.div>
                      )}
                      
                      {(userRole === "chief" || userRole === "admin") && (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link
                            href="/kitchen"
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm text-white hover:bg-white/10"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <ChefHat size={18} />
                            <span className="font-medium">المطبخ</span>
                          </Link>
                        </motion.div>
                      )}
                      
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <button
                          onClick={handleAdminLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm text-red-400 hover:bg-red-500/10 text-right"
                        >
                          <LogOut size={18} />
                          <span className="font-medium">تسجيل الخروج</span>
                        </button>
                      </motion.div>
                    </>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href="/auth/signin"
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm text-[#C49A6C] hover:bg-[#C49A6C]/10"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <LogIn size={18} />
                        <span className="font-medium">تسجيل الدخول</span>
                      </Link>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation;