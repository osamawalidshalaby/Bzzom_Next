// app/layout.js
import ClientLayout from "./layout-client";


export const metadata = {
  title: "مطعم بزوم - Bazzom | أشهى الأطباق العربية الأصلية",
  description:
    "مطعم بزوم Bazzom في دمياط يقدم أشهى الأطباق العربية الأصيلة، جودة عالية، نكهات مميزة، وخدمة ممتازة. اكتشف قائمة الطعام والعروض اليومية.",
  keywords:
    "مطعم بزوم, Bazzom, مطعم عربي, أكل عربي, مطاعم دمياط, طعام شرقي, أطباق عربية, أفضل مطعم, مطعم جودة عالية",
  authors: [{ name: "مطعم بزوم - Bazzom Restaurant" }],
  openGraph: {
    title: "مطعم بزوم - Bazzom | الطعم الأصيل",
    description:
      "استمتع بأفضل الأطباق العربية الأصيلة في مطعم بزوم Bazzom، نكهات لا تُنسى وخدمة ممتازة في دمياط.",
    url: "https://www.bazzom.shop/",
    siteName: "Bazzom Restaurant",
    type: "website",
    locale: "ar_EG",
  },
  alternates: {
    canonical: "https://www.bazzom.shop/",
    languages: {
      "ar-EG": "https://www.bazzom.shop/",
    },
  },
};


export default function RootLayout({ children }) {
  return <ClientLayout>{children}</ClientLayout>;
}
