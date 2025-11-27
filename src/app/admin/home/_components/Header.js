import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Header({ title, subtitle, backUrl = "/admin" }) {
  return (
    <header className="bg-zinc-900 border-b border-[#C49A6C]/20 px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href={backUrl}
            className="text-[#C49A6C] hover:text-white transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-bold text-[#C49A6C] leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-white/60 text-xs sm:text-sm leading-tight mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
