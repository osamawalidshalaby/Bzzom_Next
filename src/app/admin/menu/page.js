"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../home/_components/Header";
import CategoriesTable from "./_components/CategoriesTable";
import MenuItemsTable from "./_components/MenuItemsTable";
import CategoryModal from "./_components/CategoryModal";
import MenuItemModal from "./_components/MenuItemModal";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../../_services/adminApi";

export default function AdminMenuControl() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("categories");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("adminAuthenticated");
    if (!auth) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Fetch data using React Query
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["menu-categories"],
    queryFn: adminApi.menuCategories.getCategories,
    enabled: isAuthenticated,
  });

  const {
    data: menuItems = [],
    isLoading: itemsLoading,
    refetch: refetchItems,
  } = useQuery({
    queryKey: ["menu-items"],
    queryFn: adminApi.menuItems.getMenuItems,
    enabled: isAuthenticated,
  });

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setShowItemModal(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowItemModal(true);
  };

  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
    setEditingCategory(null);
    refetchCategories();
  };

  const handleCloseItemModal = () => {
    setShowItemModal(false);
    setEditingItem(null);
    refetchItems();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-16">
        <div className="text-[#C49A6C] text-xl">جارٍ التحقق من الهوية...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-16">
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
        title="إدارة قائمة الطعام"
        subtitle="إدارة أصناف الطعام والفئات"
        backUrl="/admin"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-zinc-900 p-1 rounded-lg border border-[#C49A6C]/20 mb-6">
          {[
            { id: "categories", label: "الفئات" },
            { id: "items", label: "أصناف الطعام" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-[#C49A6C] text-black"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "categories" && (
          <CategoriesTable
            data={categories}
            isLoading={categoriesLoading}
            onAddNew={handleAddCategory}
            onEdit={handleEditCategory}
          />
        )}

        {activeTab === "items" && (
          <MenuItemsTable
            data={menuItems}
            categories={categories}
            isLoading={itemsLoading}
            onAddNew={handleAddItem}
            onEdit={handleEditItem}
          />
        )}
      </div>

      {/* Modals */}
      {showCategoryModal && (
        <CategoryModal
          editingCategory={editingCategory}
          onClose={handleCloseCategoryModal}
        />
      )}

      {showItemModal && (
        <MenuItemModal
          editingItem={editingItem}
          categories={categories}
          onClose={handleCloseItemModal}
        />
      )}
    </div>
  );
}
