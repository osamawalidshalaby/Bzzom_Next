"use client";

function SmallCard({head,body}) {
    return (
        <div className="bg-[#18181a] rounded-2xl px-6 pt-4 hover:translate-y-[-5px] transition">
            <h2 className="text-[#b58f67] text-right text-xl font-bold pb-6">{head}</h2>
            <p className="rtl text-[#eeeeeeb5] pb-6 text-[14px] lg:text-[16px]">{body}</p>
        </div>
    )
}

export default SmallCard;