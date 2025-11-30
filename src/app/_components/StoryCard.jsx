"use client";
import Image from 'next/image';

function StoryCard() {
    return (
        <div className="w-[95%] bg-[#18181a] p-6 m-auto rounded-2xl flex flex-col gap-6 lg:flex-row items-start container xl:max-w-7xl">
            <div className="sm:min-w-[330px]">
                <h2 className="text-[#b58f67] text-right text-2xl pb-10 font-bold">
                    بدايتنا
                </h2>
                <p className="rtl text-[#eeeeeeb5] pb-6 text-[14px] sm:text-[16px] lg:text-[16px] xl:text-[18px]">
                    بدأت قصة مطعم بَزُّوم في عام 1979 بمطبخ صغير في قلب دمياط القديمة، حيث كان حلمنا هو
                    تقديم الأطباق العربية الأصيلة بأعلى مستويات الجودة والنكهة. من خلال سنوات من الخبرة
                    والعمل الجاد، تطور مطعمنا ليصبح وجهة محبي المأكولات العربية الأصيلة.
                </p>
                <p className="rtl text-[#eeeeeeb5] text-[14px] sm:text-[16px] lg:text-[16px] xl:text-[18px]">
                    نحن نؤمن بأن الطعام ليس مجرد وجبة، بل هو تجربة ثقافية وتراثية. لذلك نحرص على استخدام
                    أفضل المكونات وأساليب الطهي التقليدية مع الابتكار في التقديم لتناسب الأذواق العصرية.
                </p>
            </div>
            <div className="rounded-2xl w-full md:max-h-[380px] mt-6 lg:m-0 lg:min-w-[500px] xl:min-w-[600px] overflow-hidden">
                <Image 
                    className="hover:scale-110 transition cursor-pointer w-full" 
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400" 
                    alt="bazzom"
                    width={600}
                    height={380}
                />
            </div>
        </div>
    )
}

export default StoryCard;