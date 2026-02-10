import HomeClient from "./HomeClient";
import supabase from "./_services/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "مطعم بزوم | Bazzom Restaurant",
  description:
    "استكشف قائمة الطعام الغنية بأشهى الأطباق العربية الأصيلة في مطعم بزوم دمياط ميدان الساعة | Explore our rich menu of authentic Arabic dishes at Bazzom Restaurant",
};

export default async function Home() {
  const { data: slides, error: slideError } = await supabase
    .from("home_slides")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const { data: featuredDishes, error: featuredDishesError } = await supabase
    .from("featured_dishes")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const { data: offers, error: offersError } = await supabase
    .from("offers")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const { data: menuItems, error: menuItemsError } = await supabase
    .from("menu_items")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(6);

  if (slideError) console.error(slideError);
  if (categoriesError) console.error(categoriesError);
  if (featuredDishesError) console.error(featuredDishesError);
  if (offersError) console.error(offersError);
  if (menuItemsError) console.error(menuItemsError);

  return (
    <HomeClient
      slides={slides}
      categories={categories}
      featuredDishes={featuredDishes}
      offers={offers}
      menuItems={menuItems}
    />
  );
}
