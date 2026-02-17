export default function Loading() {
  return (
    <div
      role="status"
      aria-label="جاري التحميل"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90"
    >
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-[#C49A6C] border-t-transparent" />
      <p className="mt-4 text-lg font-medium text-white">جاري التحميل</p>
    </div>
  );
}

