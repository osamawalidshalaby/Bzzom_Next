import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { settingsService } from "../../../_services/settings.service";
import toast from "react-hot-toast";
import {
  Upload,
  Trash2,
  GripVertical,
  Image as ImageIcon,
  Loader,
  Edit2,
  X,
  Save,
} from "lucide-react";

export default function GalleryManager() {
  const queryClient = useQueryClient();
  const [draggedItem, setDraggedItem] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [uploadMode, setUploadMode] = useState("file"); // "file" or "url"
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrlTitle, setImageUrlTitle] = useState("");

  // Fetch gallery images
  const { data: galleryImages = [], isLoading } = useQuery({
    queryKey: ["restaurant-gallery"],
    queryFn: () => settingsService.getGalleryImages(),
    staleTime: 1000 * 60 * 5,
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      setIsUploading(true);
      return settingsService.uploadGalleryImage(file, file.name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["restaurant-gallery"]);
      toast.success("تم تحميل الصورة بنجاح!");
      setIsUploading(false);
    },
    onError: (error) => {
      toast.error(error.message || "فشل تحميل الصورة");
      setIsUploading(false);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async ({ id, storagePath }) => {
      return settingsService.deleteGalleryImage(id, storagePath);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["restaurant-gallery"]);
      toast.success("تم حذف الصورة بنجاح!");
    },
    onError: (error) => {
      toast.error(error.message || "فشل حذف الصورة");
    },
  });

  // Reorder mutation
  const reorderMutation = useMutation({
    mutationFn: (images) => settingsService.updateGalleryOrder(images),
    onSuccess: () => {
      queryClient.invalidateQueries(["restaurant-gallery"]);
      toast.success("تم تحديث ترتيب الصور");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data) =>
      settingsService.updateGalleryImageDetails(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["restaurant-gallery"]);
      toast.success("تم تحديث الصورة بنجاح!");
      setEditingImage(null);
    },
    onError: (error) => {
      toast.error(error.message || "فشل تحديث الصورة");
    },
  });

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          uploadMutation.mutate(file);
        } else {
          toast.error(`${file.name} ليست صورة`);
        }
      });
    }
  };

  const handleAddImageFromUrl = () => {
    if (!imageUrl.trim()) {
      toast.error("الرجاء إدخال رابط الصورة");
      return;
    }

    if (!imageUrlTitle.trim()) {
      toast.error("الرجاء إدخال عنوان الصورة");
      return;
    }

    // Validate URL format
    try {
      new URL(imageUrl);
    } catch {
      toast.error("رابط الصورة غير صحيح");
      return;
    }

    setIsUploading(true);
    settingsService
      .addGalleryImageFromUrl(imageUrl, imageUrlTitle)
      .then(() => {
        queryClient.invalidateQueries(["restaurant-gallery"]);
        toast.success("تم إضافة الصورة من الرابط بنجاح!");
        setImageUrl("");
        setImageUrlTitle("");
        setUploadMode("file");
        setIsUploading(false);
      })
      .catch((error) => {
        toast.error(error.message || "فشل إضافة الصورة");
        setIsUploading(false);
      });
  };

  const handleDragStart = (e, image) => {
    setDraggedItem(image);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetImage) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetImage.id) return;

    const newOrder = [...galleryImages];
    const draggedIndex = newOrder.findIndex((img) => img.id === draggedItem.id);
    const targetIndex = newOrder.findIndex((img) => img.id === targetImage.id);

    // Swap items
    [newOrder[draggedIndex], newOrder[targetIndex]] = [
      newOrder[targetIndex],
      newOrder[draggedIndex],
    ];

    reorderMutation.mutate(newOrder);
    setDraggedItem(null);
  };

  const handleDeleteImage = (id, storagePath) => {
    if (window.confirm("هل أنت متأكد من حذف هذه الصورة؟")) {
      deleteMutation.mutate({ id, storagePath });
    }
  };

  const handleEditImage = (image) => {
    setEditingImage(image);
    setEditTitle(image.title || "");
    setEditDescription(image.description || "");
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim()) {
      toast.error("الرجاء إدخال عنوان للصورة");
      return;
    }

    updateMutation.mutate({
      id: editingImage.id,
      title: editTitle,
      description: editDescription,
    });
  };

  return (
    <div className="bg-zinc-900 border border-[#C49A6C]/20 rounded-lg p-6">
      <h3 className="text-xl font-bold text-[#C49A6C] mb-6 flex items-center gap-2">
        <ImageIcon className="w-6 h-6" />
        معرض صور المطعم
      </h3>

      {/* Upload Area */}
      <div className="mb-8">
        {/* Upload Mode Tabs */}
        <div className="flex gap-2 mb-4 border-b border-[#C49A6C]/20">
          <button
            onClick={() => setUploadMode("file")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              uploadMode === "file"
                ? "border-[#C49A6C] text-[#C49A6C]"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            📤 رفع ملف صورة
          </button>
          <button
            onClick={() => setUploadMode("url")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              uploadMode === "url"
                ? "border-[#C49A6C] text-[#C49A6C]"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            🔗 إضافة من رابط
          </button>
        </div>

        {/* File Upload Mode */}
        {uploadMode === "file" && (
          <label className="block mb-4">
            <div className="border-2 border-dashed border-[#C49A6C]/30 rounded-lg p-8 text-center cursor-pointer hover:border-[#C49A6C]/60 hover:bg-white/5 transition-colors">
              <div className="flex flex-col items-center gap-3">
                <Upload className="w-8 h-8 text-[#C49A6C]" />
                <div>
                  <p className="text-white font-medium">
                    اسحب الصور هنا أو انقر للاختيار
                  </p>
                  <p className="text-white/60 text-sm mt-1">
                    PNG, JPG, GIF - بحد أقصى 5MB
                  </p>
                </div>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
              />
            </div>
          </label>
        )}

        {/* URL Upload Mode */}
        {uploadMode === "url" && (
          <div className="bg-zinc-800 border border-[#C49A6C]/20 rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">
                رابط الصورة (URL)
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                disabled={isUploading}
                className="w-full bg-zinc-900 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C]"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-white/50 text-xs mt-1">
                أدخل الرابط الكامل للصورة (يجب أن يبدأ بـ http:// أو https://)
              </p>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                عنوان الصورة
              </label>
              <input
                type="text"
                value={imageUrlTitle}
                onChange={(e) => setImageUrlTitle(e.target.value)}
                disabled={isUploading}
                className="w-full bg-zinc-900 border border-[#C49A6C]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C]"
                placeholder="أدخل عنوان الصورة"
              />
            </div>

            <button
              onClick={handleAddImageFromUrl}
              disabled={
                isUploading || !imageUrl.trim() || !imageUrlTitle.trim()
              }
              className="w-full bg-[#C49A6C] hover:bg-[#B8895A] disabled:opacity-50 disabled:cursor-not-allowed text-black font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  جاري الإضافة...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  إضافة الصورة
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-6 h-6 text-[#C49A6C] animate-spin" />
        </div>
      ) : galleryImages.length > 0 ? (
        <div className="space-y-3">
          <p className="text-white/70 text-sm mb-4">
            {galleryImages.length} صور • اسحب لتغيير الترتيب
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryImages.map((image) => (
              <div
                key={image.id}
                draggable
                onDragStart={(e) => handleDragStart(e, image)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, image)}
                className={`relative group rounded-lg overflow-hidden bg-zinc-800 border border-[#C49A6C]/20 transition-all cursor-move ${
                  draggedItem?.id === image.id
                    ? "opacity-50"
                    : "hover:border-[#C49A6C]/60"
                }`}
              >
                {/* Image */}
                <img
                  src={image.image_url}
                  alt={image.title}
                  className="w-full h-40 object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-3">
                  {/* Drag Handle */}
                  <button className="p-2 bg-white/20 rounded hover:bg-white/30 transition-colors">
                    <GripVertical className="w-5 h-5 text-white" />
                  </button>

                  <div className="flex gap-2">
                    {/* Edit Button */}
                    <button
                      onClick={() => handleEditImage(image)}
                      className="p-2 bg-blue-500/80 hover:bg-blue-600 rounded transition-colors"
                      title="تعديل الصورة"
                    >
                      <Edit2 className="w-5 h-5 text-white" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() =>
                        handleDeleteImage(image.id, image.storage_path)
                      }
                      disabled={deleteMutation.isPending}
                      className="p-2 bg-red-500/80 hover:bg-red-600 rounded transition-colors disabled:opacity-50"
                      title="حذف الصورة"
                    >
                      <Trash2 className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <ImageIcon className="w-12 h-12 text-white/30 mx-auto mb-3" />
          <p className="text-white/60">
            لا توجد صور بعد. قم بتحميل الصور الأولى!
          </p>
        </div>
      )}

      {/* Upload Status */}
      {isUploading && (
        <div className="mt-6 bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 flex items-center gap-3">
          <Loader className="w-5 h-5 text-blue-400 animate-spin" />
          <p className="text-blue-200">جاري تحميل الصور...</p>
        </div>
      )}

      {/* Edit Modal */}
      {editingImage && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-[#C49A6C]/30 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-[#C49A6C]">تعديل الصورة</h4>
              <button
                onClick={() => setEditingImage(null)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Preview */}
            <div className="mb-4">
              <img
                src={editingImage.image_url}
                alt={editingImage.title}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className="block text-white font-medium mb-2">
                عنوان الصورة
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C]"
                placeholder="أدخل عنوان الصورة"
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-2">
                الوصف (اختياري)
              </label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows="3"
                className="w-full bg-zinc-800 border border-[#C49A6C]/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-[#C49A6C]"
                placeholder="أدخل وصف الصورة"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setEditingImage(null)}
                className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={updateMutation.isPending}
                className="px-4 py-2 rounded-lg bg-[#C49A6C] hover:bg-[#B8895A] disabled:opacity-50 text-black font-medium flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                حفظ التعديلات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
