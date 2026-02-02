

// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Header from "./_components/Header";
// import TabsNavigation from "./_components/TabsNavigation";
// import DataTable from "./_components/DataTable";
// import AddEditModal from "./_components/AddEditModal";
// import { Toaster } from "react-hot-toast";
// import { useQuery } from "@tanstack/react-query";
// import { adminApi } from "../../_services/adminApi";

// export default function AdminHomeControl() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [activeTab, setActiveTab] = useState("slides");
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [editingItem, setEditingItem] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const auth = localStorage.getItem("adminAuthenticated");
//     if (!auth) {
//       router.push("/admin/login");
//     } else {
//       setIsAuthenticated(true);
//     }
//   }, [router]);

//   // Fetch data using React Query
//   const { data: slides = [], isLoading: slidesLoading } = useQuery({
//     queryKey: ["home-slides"],
//     queryFn: adminApi.home.getSlides,
//     enabled: isAuthenticated,
//   });

//   const { data: featuredDishes = [], isLoading: dishesLoading } = useQuery({
//     queryKey: ["featured-dishes"],
//     queryFn: adminApi.featuredDishes.getFeaturedDishes,
//     enabled: isAuthenticated,
//   });

//   const { data: offers = [], isLoading: offersLoading } = useQuery({
//     queryKey: ["offers"],
//     queryFn: adminApi.offers.getOffers,
//     enabled: isAuthenticated,
//   });

//   const { data: categories = [], isLoading: categoriesLoading } = useQuery({
//     queryKey: ["categories"],
//     queryFn: adminApi.categories.getCategories,
//     enabled: isAuthenticated,
//   });

//   const handleAddNew = () => {
//     setEditingItem(null);
//     setShowAddModal(true);
//   };

//   const handleEdit = (item) => {
//     setEditingItem(item);
//     setShowAddModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowAddModal(false);
//     setEditingItem(null);
//   };

//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center pt-16">
//         {" "}
//         {/* Added pt-16 here */}
//         <div className="text-[#C49A6C] text-xl">جارٍ التحقق من الهوية...</div>
//       </div>
//     );
//   }

//   const getCurrentData = () => {
//     switch (activeTab) {
//       case "slides":
//         return {
//           data: slides,
//           loading: slidesLoading,
//           columns: ["العنوان", "الوصف", "الحالة"],
//         };
//       case "dishes":
//         return {
//           data: featuredDishes,
//           loading: dishesLoading,
//           columns: ["الاسم", "السعر", "الحالة"],
//         };
//       case "offers":
//         return {
//           data: offers,
//           loading: offersLoading,
//           columns: ["العنوان", "السعر", "الحالة"],
//         };
//       case "categories":
//         return {
//           data: categories,
//           loading: categoriesLoading,
//           columns: ["الاسم العربي", "الاسم الإنجليزي", "الحالة"],
//         };
//       default:
//         return { data: [], loading: false, columns: [] };
//     }
//   };

//   const { data, loading, columns } = getCurrentData();

//   return (
//     <div className="min-h-screen bg-black text-white pt-16">
//       {" "}
//       {/* Added pt-16 here */}
//       <Toaster
//         position="top-center"
//         toastOptions={{
//           duration: 3000,
//           style: {
//             background: "#1f2937",
//             color: "#fff",
//             border: "1px solid #C49A6C",
//           },
//         }}
//       />
//       <Header
//         title="إدارة الصفحة الرئيسية"
//         subtitle="إدارة محتوى الصفحة الرئيسية"
//         backUrl="/admin"
//       />
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <TabsNavigation
//           activeTab={activeTab}
//           setActiveTab={setActiveTab}
//           tabs={[
//             { id: "slides", label: "الشرائح" },
//             { id: "dishes", label: "الأطباق المميزة" },
//             { id: "offers", label: "العروض" },
//             { id: "categories", label: "التصنيفات" }, // تمت الإضافة
//           ]}
//         />

//         <div className="mt-6">
//           <DataTable
//             type={activeTab}
//             data={data}
//             columns={columns}
//             isLoading={loading}
//             onAddNew={handleAddNew}
//             onEdit={handleEdit}
//           />
//         </div>
//       </div>
//       {showAddModal && (
//         <AddEditModal
//           type={activeTab}
//           editingItem={editingItem}
//           onClose={handleCloseModal}
//         />
//       )}
//     </div>
//   );
// }


"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "./_components/Header";
import TabsNavigation from "./_components/TabsNavigation";
import DataTable from "./_components/DataTable";
import AddEditModal from "./_components/AddEditModal";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../../_services/adminApi";

export default function AdminHomeControl() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [activeTab, setActiveTab] = useState("slides");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await adminApi.auth.checkAuth();
      if (!isAuth) {
        router.push("/admin/login");
        return;
      }

      const role = adminApi.auth.getCurrentRole();
      if (!role || role !== "admin") {
        toast.error("غير مصرح لك بالوصول إلى هذه الصفحة");
        router.push("/admin/dashboard");
        return;
      }

      setUserRole(role);
      setIsAuthenticated(true);
    };

    checkAuth();
  }, [router]);

  // Fetch data using React Query
  const { data: slides = [], isLoading: slidesLoading } = useQuery({
    queryKey: ["home-slides"],
    queryFn: adminApi.home.getSlides,
    enabled: isAuthenticated,
  });

  const { data: featuredDishes = [], isLoading: dishesLoading } = useQuery({
    queryKey: ["featured-dishes"],
    queryFn: adminApi.featuredDishes.getFeaturedDishes,
    enabled: isAuthenticated,
  });

  const { data: offers = [], isLoading: offersLoading } = useQuery({
    queryKey: ["offers"],
    queryFn: adminApi.offers.getOffers,
    enabled: isAuthenticated,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: adminApi.categories.getCategories,
    enabled: isAuthenticated,
  });

  const handleAddNew = () => {
    setEditingItem(null);
    setShowAddModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingItem(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-16">
        {" "}
        {/* Added pt-16 here */}
        <div className="text-[#C49A6C] text-xl">جارٍ التحقق من الهوية...</div>
      </div>
    );
  }

  if (userRole !== "admin") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-16">
        <div className="text-red-500 text-xl">غير مصرح لك بالوصول إلى هذه الصفحة</div>
      </div>
    );
  }

  const getCurrentData = () => {
    switch (activeTab) {
      case "slides":
        return {
          data: slides,
          loading: slidesLoading,
          columns: ["العنوان", "الوصف", "الحالة"],
        };
      case "dishes":
        return {
          data: featuredDishes,
          loading: dishesLoading,
          columns: ["الاسم", "السعر", "الحالة"],
        };
      case "offers":
        return {
          data: offers,
          loading: offersLoading,
          columns: ["العنوان", "السعر", "الحالة"],
        };
      case "categories":
        return {
          data: categories,
          loading: categoriesLoading,
          columns: ["الاسم العربي", "الاسم الإنجليزي", "الحالة"],
        };
      default:
        return { data: [], loading: false, columns: [] };
    }
  };

  const { data, loading, columns } = getCurrentData();

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      {" "}
      {/* Added pt-16 here */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #C49A6C",
          },
        }}
      />
      <Header
        title="إدارة الصفحة الرئيسية"
        subtitle="إدارة محتوى الصفحة الرئيسية"
        backUrl="/admin/dashboard"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <TabsNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={[
            { id: "slides", label: "الشرائح" },
            { id: "dishes", label: "الأطباق المميزة" },
            { id: "offers", label: "العروض" },
            { id: "categories", label: "التصنيفات" }, // تمت الإضافة
          ]}
        />

        <div className="mt-6">
          <DataTable
            type={activeTab}
            data={data}
            columns={columns}
            isLoading={loading}
            onAddNew={handleAddNew}
            onEdit={handleEdit}
          />
        </div>
      </div>
      {showAddModal && (
        <AddEditModal
          type={activeTab}
          editingItem={editingItem}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}