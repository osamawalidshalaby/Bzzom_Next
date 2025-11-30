// app/reviews/components/ReviewsList.js
import ReviewCard from "../../_components/ReviewCard";

const ReviewsList = ({ reviews }) => {
  return (
    <div className="w-[95%] bg-black py-6 m-auto mb-10 rounded-2xl flex flex-col gap-6 container xl:max-w-5xl">
      {reviews?.map((review) => (
        <ReviewCard review={review} key={review.id} />
      ))}
    </div>
  );
};

export default ReviewsList;
