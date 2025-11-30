import HomeClient from "./HomeClient";
import supabase from "./_services/supabase";


export const metadata = {
  title: "مطعم بزوم | Bazzom Restaurant",
  description:
    "استكشف قائمة الطعام الغنية بأشهى الأطباق العربية الأصيلة في مطعم بزوم دمياط ميدان الساعة | Explore our rich menu of authentic Arabic dishes at Bazzom Restaurant",
};

export default async function Home() {
  const { data: slides, error : slideError } = await supabase
    .from("home_slides")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const { data: categories , error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (slideError) console.error(error);



  return <HomeClient slides={slides} categories={categories} />;
}



