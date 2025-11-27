export default function TabsNavigation({ activeTab, setActiveTab, tabs }) {
  return (
    <div className="flex gap-1 bg-zinc-900 p-1 rounded-lg border border-[#C49A6C]/20">
      {tabs.map((tab) => (
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
  );
}
