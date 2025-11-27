// app/reviews/ReviewsClient.js (Client Component)
"use client";
import { useQuery } from "@tanstack/react-query";
import { getReviews } from "../_services/reviewApi";
import ReviewCard from "../_components/ReviewCard";
import ReviewForm from "../_components/ReviewForm";
import Footer from "../_components/Footer";
import Spinner from "../loading";
import toast from "react-hot-toast";

// Components
import ReviewsHeader from "./_components/ReviewsHeader";
import ReviewsList from "./_components/ReviewsList";

export default function ReviewsClient() {
  const { isLoading, data, error } = useQuery({
    queryKey: ["reviews"],
    queryFn: getReviews,
  });

  if (error) {
    toast.error(error.message);
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-[#000000] pt-14">
        <ReviewsHeader />
        <ReviewForm />
      </div>

      {isLoading ? <Spinner /> : <ReviewsList reviews={data} />}

      <Footer />
    </div>
  );
}
