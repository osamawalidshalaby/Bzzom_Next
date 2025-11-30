// "use client";
// import { useQuery } from "@tanstack/react-query";
// import { getReviews } from "../_services/reviewApi";
// import ReviewCard from "../_components/ReviewCard";
// import ReviewForm from "../_components/ReviewForm";
// import Footer from "../_components/Footer";
// import Spinner from "../loading";
// import toast from "react-hot-toast";


// export default function Reviews() {
//   const { isLoading, data, error } = useQuery({
//     queryKey: ["reviews"],
//     queryFn: getReviews,
//   });

//   if (error) {
//     toast.error(error.message);
//   }

//   return (
//     <div className="min-h-screen bg-black">
//       <div className="bg-[#000000] pt-14">
//         <h1 className="text-[#C49A6C] font-bold text-4xl md:text-5xl p-12 md:p-16 text-center">
//           آراء العملاء
//         </h1>
//         <ReviewForm />
//       </div>

//       {isLoading ? (
//         <Spinner />
//       ) : (
//         <div className="w-[95%] bg-black py-6 m-auto mb-10 rounded-2xl flex flex-col gap-6 container xl:max-w-5xl">
//           {data?.map((review) => (
//             <ReviewCard review={review} key={review.id} />
//           ))}
//         </div>
//       )}

//       <Footer />
//     </div>
//   );
// }


// app/reviews/page.js (Server Component)

import ReviewsClient from './ReviewsClient';

import { reviewsMetadata } from "../metadata";


export const metadata = reviewsMetadata;

const Reviews = () => {
  return <ReviewsClient />;
};

export default Reviews;