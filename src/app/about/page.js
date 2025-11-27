import StoryCard from "../_components/StoryCard";
import SmallCard from "../_components/SmallCard";
import RestaurantGallery from "../_components/RestaurantGallery";
import { restaurantPhotos } from "../_data/homeData";
import Footer from "../_components/Footer";
import { aboutMetadata } from "../metadata";


export const metadata = aboutMetadata;


export default function About() {
  return (
    <div className="bg-[#000000] pt-14">
      <h1 className="text-[#C49A6C] font-bold text-4xl md:text-5xl p-12 md:p-16 text-center">
        قصة بَزُوم
      </h1>
      <StoryCard />
      <div className="w-[95%] container flex flex-col gap-y-6 m-auto sm:flex-row gap-6 py-12 xl:max-w-7xl">
        <SmallCard
          head={"رسالتنا"}
          body={
            "تقديم تجربة طعام استثنائية تجمع بين الأصالة والجودة والابتكار، مع الحفاظ على التقاليد والتراث العربي في الطهي."
          }
        />
        <SmallCard
          head={"رؤيتنا"}
          body={
            "أن نكون الوجهة الأولى لمحبي المأكولات العربية الأصيلة في المنطقة، وأن ننشر ثقافة الطعام العربي الأصيل حول العالم."
          }
        />
      </div>
      <RestaurantGallery photos={restaurantPhotos} />
      <Footer />
    </div>
  );
}
