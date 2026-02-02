// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { adminApi } from "../../_services/adminApi";
// import toast, { Toaster } from "react-hot-toast";
// import {
//   Plus,
//   Trash2,
//   User,
//   Mail,
//   Phone,
//   Shield,
//   ChefHat,
//   ShoppingBag,
//   Search,
//   Key,
//   Eye,
//   EyeOff,
// } from "lucide-react";

// export default function UsersManagement() {
//   const [users, setUsers] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     name: "",
//     phone: "",
//     role: "cashier",
//   });
//   const router = useRouter();

//   useEffect(() => {
//     checkAuthAndLoadUsers();
//   }, []);

//   const checkAuthAndLoadUsers = async () => {
//     try {
//       const isAuth = await adminApi.auth.checkAuth();
//       if (!isAuth) {
//         router.push("/admin/login");
//         return;
//       }

//       const role = adminApi.auth.getCurrentRole();
//       if (role !== "admin") {
//         toast.error("غير مصرح لك بالوصول إلى هذه الصفحة");
//         if (role === "chief") {
//           router.push("/kitchen");
//         } else if (role === "cashier") {
//           router.push("/orders");
//         } else {
//           router.push("/");
//         }
//         return;
//       }

//       await loadUsers();
//     } catch (error) {
//       console.error("Error:", error);
//       router.push("/admin/login");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const loadUsers = async () => {
//     try {
//       const usersList = await adminApi.auth.getAllUsers();
//       setUsers(usersList);
//     } catch (error) {
//       console.error("Load users error:", error);
//       toast.error("حدث خطأ في تحميل المستخدمين");
//     }
//   };

//   const handleAddUser = async (e) => {
//     e.preventDefault();
//     try {
//       // التحقق من أن المستخدم الحالي مدير
//       const currentRole = adminApi.auth.getCurrentRole();
//       if (currentRole !== "admin") {
//         toast.error("غير مصرح لك بإنشاء حسابات جديدة");
//         return;
//       }

//       // استخدام دالة createUser الموجودة في authApi
//       await adminApi.auth.createUser({
//         email: formData.email,
//         password: formData.password,
//         name: formData.name,
//         phone: formData.phone,
//         role: formData.role,
//       });

//       toast.success(`تم إنشاء حساب ${getRoleArabic(formData.role)} بنجاح`);
//       setShowAddModal(false);
//       resetForm();
//       await loadUsers();
//     } catch (error) {
//       console.error("Add user error:", error);

//       // عرض رسالة خطأ مناسبة
//       if (
//         error.message.includes("User already registered") ||
//         error.message.includes("already exists")
//       ) {
//         toast.error("هذا البريد الإلكتروني مسجل بالفعل");
//       } else if (error.message.includes("Password should be at least")) {
//         toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
//       } else if (error.message.includes("غير مصرح")) {
//         toast.error("غير مصرح لك بإنشاء حسابات جديدة");
//       } else {
//         toast.error(error.message || "حدث خطأ في إنشاء الحساب");
//       }
//     }
//   };

//   const handleDeleteUser = async (userId) => {
//     if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;

//     try {
//       // لا يمكن للمدير حذف نفسه
//       const currentUserId = localStorage.getItem("userId");
//       if (currentUserId === userId) {
//         toast.error("لا يمكنك حذف حسابك الخاص");
//         return;
//       }

//       await adminApi.auth.deleteUser(userId);
//       toast.success("تم حذف المستخدم بنجاح");
//       await loadUsers();
//     } catch (error) {
//       console.error("Delete user error:", error);
//       toast.error("حدث خطأ في حذف المستخدم");
//     }
//   };

//   const handleToggleUserStatus = async (userId, currentStatus) => {
//     try {
//       // استخدام دالة updateUserStatus من authApi
//       await adminApi.auth.updateUserStatus(userId, !currentStatus);

//       toast.success(`تم ${!currentStatus ? "تفعيل" : "إيقاف"} الحساب بنجاح`);
//       await loadUsers();
//     } catch (error) {
//       console.error("Toggle user status error:", error);
//       toast.error("حدث خطأ في تغيير حالة الحساب");
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       email: "",
//       password: "",
//       name: "",
//       phone: "",
//       role: "cashier",
//     });
//     setShowPassword(false);
//   };

//   const getRoleArabic = (role) => {
//     switch (role) {
//       case "admin":
//         return "مدير";
//       case "chief":
//         return "شيف";
//       case "cashier":
//         return "كاشير";
//       default:
//         return role;
//     }
//   };

//   const getRoleIcon = (role) => {
//     switch (role) {
//       case "admin":
//         return <Shield className="w-5 h-5" />;
//       case "chief":
//         return <ChefHat className="w-5 h-5" />;
//       case "cashier":
//         return <ShoppingBag className="w-5 h-5" />;
//       default:
//         return <User className="w-5 h-5" />;
//     }
//   };

//   const getRoleColor = (role) => {
//     switch (role) {
//       case "admin":
//         return "bg-blue-500/20 text-blue-400";
//       case "chief":
//         return "bg-green-500/20 text-green-400";
//       case "cashier":
//         return "bg-purple-500/20 text-purple-400";
//       default:
//         return "bg-gray-500/20 text-gray-400";
//     }
//   };

//   const filteredUsers = users.filter(
//     (user) =>
//       user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (user.name &&
//         user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       getRoleArabic(user.role).includes(searchTerm)
//   );

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-black pt-16 flex items-center justify-center">
//         <div className="text-[#C49A6C] text-xl">جارٍ التحميل...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black text-white pt-16">
//       <Toaster position="top-right" />

//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-2xl font-bold text-white">
//               إدارة حسابات الموظفين
//             </h1>
//             <p className="text-white/60">
//               يمكنك إنشاء حسابات جديدة للشيف والكاشير والمديرين
//             </p>
//           </div>
//           <button
//             onClick={() => setShowAddModal(true)}
//             className="bg-[#C49A6C] hover:bg-[#B8895A] text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
//           >
//             <Plus className="w-4 h-4" />
//             إنشاء حساب جديد
//           </button>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
//           <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-blue-500/20 rounded-lg">
//                 <Shield className="w-5 h-5 text-blue-400" />
//               </div>
//               <div>
//                 <p className="text-white/60 text-sm">المديرون</p>
//                 <p className="text-2xl font-bold text-white">
//                   {users.filter((u) => u.role === "admin").length}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-green-500/20 rounded-lg">
//                 <ChefHat className="w-5 h-5 text-green-400" />
//               </div>
//               <div>
//                 <p className="text-white/60 text-sm">الشيفات</p>
//                 <p className="text-2xl font-bold text-white">
//                   {users.filter((u) => u.role === "chief").length}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-purple-500/20 rounded-lg">
//                 <ShoppingBag className="w-5 h-5 text-purple-400" />
//               </div>
//               <div>
//                 <p className="text-white/60 text-sm">الكاشيرات</p>
//                 <p className="text-2xl font-bold text-white">
//                   {users.filter((u) => u.role === "cashier").length}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-yellow-500/20 rounded-lg">
//                 <User className="w-5 h-5 text-yellow-400" />
//               </div>
//               <div>
//                 <p className="text-white/60 text-sm">إجمالي الحسابات</p>
//                 <p className="text-2xl font-bold text-white">{users.length}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Search Bar */}
//         <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4 mb-6">
//           <div className="relative">
//             <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
//             <input
//               type="text"
//               placeholder="ابحث عن مستخدم بالاسم أو البريد الإلكتروني أو الدور..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 pr-12 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
//             />
//           </div>
//         </div>

//         {/* Users Table */}
//         <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 overflow-hidden">
//           {filteredUsers.length === 0 ? (
//             <div className="p-8 text-center">
//               <User className="w-12 h-12 text-white/20 mx-auto mb-4" />
//               <p className="text-white/60">لا توجد حسابات</p>
//               <button
//                 onClick={() => setShowAddModal(true)}
//                 className="mt-4 text-[#C49A6C] hover:text-[#B8895A]"
//               >
//                 إنشاء أول حساب
//               </button>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-white/10">
//                     <th className="text-right p-4 text-white/60">الموظف</th>
//                     <th className="text-right p-4 text-white/60">الدور</th>
//                     <th className="text-right p-4 text-white/60">الحالة</th>
//                     <th className="text-right p-4 text-white/60">
//                       تاريخ الإنشاء
//                     </th>
//                     <th className="text-right p-4 text-white/60">الإجراءات</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredUsers.map((user) => (
//                     <tr
//                       key={user.id}
//                       className="border-b border-white/5 hover:bg-white/5"
//                     >
//                       <td className="p-4">
//                         <div className="flex items-center gap-3">
//                           <div className="w-12 h-12 rounded-full bg-[#C49A6C]/20 flex items-center justify-center">
//                             {getRoleIcon(user.role)}
//                           </div>
//                           <div>
//                             <p className="font-medium text-white">
//                               {user.name || "بدون اسم"}
//                             </p>
//                             <p className="text-white/60 text-sm flex items-center gap-1">
//                               <Mail className="w-3 h-3" />
//                               {user.email}
//                             </p>
//                             {user.phone && (
//                               <p className="text-white/60 text-sm flex items-center gap-1">
//                                 <Phone className="w-3 h-3" />
//                                 {user.phone}
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         <div className="flex items-center gap-2">
//                           <span
//                             className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(
//                               user.role
//                             )}`}
//                           >
//                             {getRoleArabic(user.role)}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         <button
//                           onClick={() =>
//                             handleToggleUserStatus(user.id, user.is_active)
//                           }
//                           className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
//                             user.is_active
//                               ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
//                               : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
//                           }`}
//                         >
//                           {user.is_active ? "نشط" : "موقوف"}
//                         </button>
//                       </td>
//                       <td className="p-4 text-white/60">
//                         {new Date(user.created_at).toLocaleDateString("ar-EG", {
//                           year: "numeric",
//                           month: "long",
//                           day: "numeric",
//                         })}
//                       </td>
//                       <td className="p-4">
//                         <div className="flex items-center gap-2 justify-end">
//                           <button
//                             onClick={() => handleDeleteUser(user.id)}
//                             className="text-red-400 hover:text-red-300 p-2 transition-colors"
//                             title="حذف الحساب"
//                             disabled={
//                               user.role === "admin" &&
//                               users.filter((u) => u.role === "admin").length <=
//                                 1
//                             }
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Add User Modal */}
//         {showAddModal && (
//           <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
//             <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl font-bold text-white">
//                   إنشاء حساب موظف جديد
//                 </h2>
//                 <button
//                   onClick={() => {
//                     setShowAddModal(false);
//                     resetForm();
//                   }}
//                   className="text-white/60 hover:text-white"
//                 >
//                   ✕
//                 </button>
//               </div>

//               <form onSubmit={handleAddUser} className="space-y-4">
//                 <div>
//                   <label className="block text-white/70 text-sm mb-1">
//                     الدور
//                   </label>
//                   <div className="grid grid-cols-3 gap-2 mb-4">
//                     {["cashier", "chief", "admin"].map((role) => (
//                       <button
//                         key={role}
//                         type="button"
//                         onClick={() => setFormData({ ...formData, role })}
//                         className={`p-3 rounded-lg border transition-all ${
//                           formData.role === role
//                             ? `${getRoleColor(role)} border-[#C49A6C]`
//                             : "bg-zinc-800 border-zinc-700 hover:border-[#C49A6C]/50"
//                         }`}
//                       >
//                         <div className="flex flex-col items-center gap-2">
//                           {getRoleIcon(role)}
//                           <span className="text-sm">{getRoleArabic(role)}</span>
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-white/70 text-sm mb-1">
//                     الاسم الكامل
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     value={formData.name}
//                     onChange={(e) =>
//                       setFormData({ ...formData, name: e.target.value })
//                     }
//                     className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C49A6C]"
//                     placeholder="أدخل اسم الموظف"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-white/70 text-sm mb-1">
//                     البريد الإلكتروني
//                   </label>
//                   <input
//                     type="email"
//                     required
//                     value={formData.email}
//                     onChange={(e) =>
//                       setFormData({ ...formData, email: e.target.value })
//                     }
//                     className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C49A6C]"
//                     placeholder="employee@bazzom.com"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-white/70 text-sm mb-1">
//                     رقم الهاتف
//                   </label>
//                   <input
//                     type="tel"
//                     value={formData.phone}
//                     onChange={(e) =>
//                       setFormData({ ...formData, phone: e.target.value })
//                     }
//                     className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C49A6C]"
//                     placeholder="01XXXXXXXXX"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-white/70 text-sm mb-1">
//                     كلمة المرور
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       required
//                       minLength="6"
//                       value={formData.password}
//                       onChange={(e) =>
//                         setFormData({ ...formData, password: e.target.value })
//                       }
//                       className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:border-[#C49A6C]"
//                       placeholder="أدخل كلمة مرور قوية"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C49A6C] hover:text-white"
//                     >
//                       {showPassword ? (
//                         <EyeOff className="w-5 h-5" />
//                       ) : (
//                         <Eye className="w-5 h-5" />
//                       )}
//                     </button>
//                   </div>
//                   <p className="text-white/50 text-xs mt-1">
//                     كلمة المرور يجب أن تكون 6 أحرف على الأقل
//                   </p>
//                 </div>

//                 <div className="pt-4 border-t border-white/10">
//                   <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
//                     <div className="flex items-start gap-2">
//                       <Key className="w-4 h-4 text-blue-400 mt-0.5" />
//                       <p className="text-blue-300 text-sm">
//                         سيتلقى الموظف بريدًا إلكترونيًا لتأكيد الحساب. يمكنه
//                         استخدام كلمة المرور هذه لتسجيل الدخول.
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex gap-2">
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setShowAddModal(false);
//                         resetForm();
//                       }}
//                       className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-3 rounded-lg transition-colors"
//                     >
//                       إلغاء
//                     </button>
//                     <button
//                       type="submit"
//                       className="flex-1 bg-[#C49A6C] hover:bg-[#B8895A] text-black px-4 py-3 rounded-lg transition-colors font-medium"
//                     >
//                       إنشاء الحساب
//                     </button>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "../../_services/adminApi";
import toast, { Toaster } from "react-hot-toast";
import {
  Plus,
  Trash2,
  User,
  Mail,
  Phone,
  Shield,
  ChefHat,
  ShoppingBag,
  Search,
  Key,
  Eye,
  EyeOff,
} from "lucide-react";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    role: "cashier",
  });
  const router = useRouter();

  useEffect(() => {
    checkAuthAndLoadUsers();
  }, []);

  const checkAuthAndLoadUsers = async () => {
    try {
      const isAuth = await adminApi.auth.checkAuth();
      if (!isAuth) {
        router.push("/admin/login");
        return;
      }

      const role = adminApi.auth.getCurrentRole();
      if (!role || role !== "admin") {
        toast.error("غير مصرح لك بالوصول إلى هذه الصفحة");
        if (role === "chief") {
          router.push("/kitchen");
        } else if (role === "cashier") {
          router.push("/orders");
        } else {
          router.push("/admin/dashboard");
        }
        return;
      }

      setUserRole(role);
      await loadUsers();
    } catch (error) {
      console.error("Error:", error);
      router.push("/admin/login");
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const usersList = await adminApi.auth.getAllUsers();
      setUsers(usersList);
    } catch (error) {
      console.error("Load users error:", error);
      toast.error("حدث خطأ في تحميل المستخدمين");
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      // التحقق من أن المستخدم الحالي مدير
      const currentRole = adminApi.auth.getCurrentRole();
      if (currentRole !== "admin") {
        toast.error("غير مصرح لك بإنشاء حسابات جديدة");
        return;
      }

      // استخدام دالة createUser الموجودة في authApi
      await adminApi.auth.createUser({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        role: formData.role,
      });

      toast.success(`تم إنشاء حساب ${getRoleArabic(formData.role)} بنجاح`);
      setShowAddModal(false);
      resetForm();
      await loadUsers();
    } catch (error) {
      console.error("Add user error:", error);

      // عرض رسالة خطأ مناسبة
      if (
        error.message.includes("User already registered") ||
        error.message.includes("already exists")
      ) {
        toast.error("هذا البريد الإلكتروني مسجل بالفعل");
      } else if (error.message.includes("Password should be at least")) {
        toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      } else if (error.message.includes("غير مصرح")) {
        toast.error("غير مصرح لك بإنشاء حسابات جديدة");
      } else {
        toast.error(error.message || "حدث خطأ في إنشاء الحساب");
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;

    try {
      // لا يمكن للمدير حذف نفسه
      const currentUserId = localStorage.getItem("userId");
      if (currentUserId === userId) {
        toast.error("لا يمكنك حذف حسابك الخاص");
        return;
      }

      await adminApi.auth.deleteUser(userId);
      toast.success("تم حذف المستخدم بنجاح");
      await loadUsers();
    } catch (error) {
      console.error("Delete user error:", error);
      toast.error("حدث خطأ في حذف المستخدم");
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      // استخدام دالة updateUserStatus من authApi
      await adminApi.auth.updateUserStatus(userId, !currentStatus);

      toast.success(`تم ${!currentStatus ? "تفعيل" : "إيقاف"} الحساب بنجاح`);
      await loadUsers();
    } catch (error) {
      console.error("Toggle user status error:", error);
      toast.error("حدث خطأ في تغيير حالة الحساب");
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      name: "",
      phone: "",
      role: "cashier",
    });
    setShowPassword(false);
  };

  const getRoleArabic = (role) => {
    switch (role) {
      case "admin":
        return "مدير";
      case "chief":
        return "شيف";
      case "cashier":
        return "كاشير";
      default:
        return role;
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Shield className="w-5 h-5" />;
      case "chief":
        return <ChefHat className="w-5 h-5" />;
      case "cashier":
        return <ShoppingBag className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-blue-500/20 text-blue-400";
      case "chief":
        return "bg-green-500/20 text-green-400";
      case "cashier":
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.name &&
        user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      getRoleArabic(user.role).includes(searchTerm)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black pt-16 flex items-center justify-center">
        <div className="text-[#C49A6C] text-xl">جارٍ التحميل...</div>
      </div>
    );
  }

  if (userRole !== "admin") {
    return (
      <div className="min-h-screen bg-black pt-16 flex items-center justify-center">
        <div className="text-red-500 text-xl">
          غير مصرح لك بالوصول إلى هذه الصفحة
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              إدارة حسابات الموظفين
            </h1>
            <p className="text-white/60">
              يمكنك إنشاء حسابات جديدة للشيف والكاشير والمديرين
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#C49A6C] hover:bg-[#B8895A] text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            إنشاء حساب جديد
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
          <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">المديرون</p>
                <p className="text-2xl font-bold text-white">
                  {users.filter((u) => u.role === "admin").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <ChefHat className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">الشيفات</p>
                <p className="text-2xl font-bold text-white">
                  {users.filter((u) => u.role === "chief").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <ShoppingBag className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">الكاشيرات</p>
                <p className="text-2xl font-bold text-white">
                  {users.filter((u) => u.role === "cashier").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <User className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">إجمالي الحسابات</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-4 mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث عن مستخدم بالاسم أو البريد الإلكتروني أو الدور..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 pr-12 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C] transition-colors"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <User className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">لا توجد حسابات</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 text-[#C49A6C] hover:text-[#B8895A]"
              >
                إنشاء أول حساب
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-right p-4 text-white/60">الموظف</th>
                    <th className="text-right p-4 text-white/60">الدور</th>
                    <th className="text-right p-4 text-white/60">الحالة</th>
                    <th className="text-right p-4 text-white/60">
                      تاريخ الإنشاء
                    </th>
                    <th className="text-right p-4 text-white/60">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-[#C49A6C]/20 flex items-center justify-center">
                            {getRoleIcon(user.role)}
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {user.name || "بدون اسم"}
                            </p>
                            <p className="text-white/60 text-sm flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </p>
                            {user.phone && (
                              <p className="text-white/60 text-sm flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {user.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(
                              user.role
                            )}`}
                          >
                            {getRoleArabic(user.role)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() =>
                            handleToggleUserStatus(user.id, user.is_active)
                          }
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            user.is_active
                              ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                              : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          }`}
                        >
                          {user.is_active ? "نشط" : "موقوف"}
                        </button>
                      </td>
                      <td className="p-4 text-white/60">
                        {new Date(user.created_at).toLocaleDateString("ar-EG", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-400 hover:text-red-300 p-2 transition-colors"
                            title="حذف الحساب"
                            disabled={
                              user.role === "admin" &&
                              users.filter((u) => u.role === "admin").length <=
                                1
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add User Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 rounded-xl border border-[#C49A6C]/20 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  إنشاء حساب موظف جديد
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm mb-1">
                    الدور
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {["cashier", "chief", "admin"].map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setFormData({ ...formData, role })}
                        className={`p-3 rounded-lg border transition-all ${
                          formData.role === role
                            ? `${getRoleColor(role)} border-[#C49A6C]`
                            : "bg-zinc-800 border-zinc-700 hover:border-[#C49A6C]/50"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          {getRoleIcon(role)}
                          <span className="text-sm">{getRoleArabic(role)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-1">
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C49A6C]"
                    placeholder="أدخل اسم الموظف"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-1">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C49A6C]"
                    placeholder="employee@bazzom.com"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-1">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C49A6C]"
                    placeholder="01XXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-1">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength="6"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:border-[#C49A6C]"
                      placeholder="أدخل كلمة مرور قوية"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C49A6C] hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-white/50 text-xs mt-1">
                    كلمة المرور يجب أن تكون 6 أحرف على الأقل
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <Key className="w-4 h-4 text-blue-400 mt-0.5" />
                      <p className="text-blue-300 text-sm">
                        سيتلقى الموظف بريدًا إلكترونيًا لتأكيد الحساب. يمكنه
                        استخدام كلمة المرور هذه لتسجيل الدخول.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        resetForm();
                      }}
                      className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-3 rounded-lg transition-colors"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-[#C49A6C] hover:bg-[#B8895A] text-black px-4 py-3 rounded-lg transition-colors font-medium"
                    >
                      إنشاء الحساب
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}