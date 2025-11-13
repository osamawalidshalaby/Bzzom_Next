"use client";
import Stars from "./Stars";
import { useForm } from "react-hook-form";
import { createReview } from "../_services/reviewApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

function ReviewForm() {
  const { register, handleSubmit, reset, formState, setValue } = useForm();
  const [rating, setRating] = useState(3);

  const queryClient = useQueryClient();
  const { isLoading, mutate } = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });
      toast.success("تم إضافة تعليقك بنجاح");
      reset();
    },
    onError: (err) => toast.error(err.message),
  });

  useEffect(() => {
    setValue("rating", rating, { shouldValidate: true });
  }, [rating, setValue]);

  function onSubmit(data) {
    mutate(data);
  }

  function onError(err) {
    console.log(err);
  }

  const { errors } = formState;

  return (
    <form
      className="w-[95%] bg-[#18181a] p-6 m-auto mb-8 rounded-2xl flex flex-col gap-6 container xl:max-w-5xl"
      onSubmit={handleSubmit(onSubmit, onError)}
    >
      <label
        htmlFor="name"
        className="text-[#C49A6C] font-bold text-2xl cursor-pointer"
      >
        اترك تقييمك
      </label>

      <input
        type="text"
        id="name"
        placeholder="الاسم"
        className="text-[#eeeeeeb5] rounded bg-[#000000] focus:outline-none focus:ring-2 focus:ring-[#C49A6C] px-4 h-14 placeholder:text-[#eeeeeeb5]"
        {...register("name", {
          required: "الرجاء إدخال الاسم",
          minLength: {
            value: 3,
            message: "الاسم يجب أن يحتوي على الأقل 3 أحرف",
          },
          maxLength: {
            value: 30,
            message: "الاسم لا يمكن أن يتجاوز 30 حرفًا",
          },
          pattern: {
            value: /^[A-Za-z\s\u0600-\u06FF]+$/i,
            message: "الاسم يجب أن يحتوي على حروف فقط",
          },
        })}
      />
      {errors.name && (
        <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
      )}

      <p className="text-[#eeeeeeb5] text-xl">التقييم:</p>
      <Stars
        set={setRating}
        defaultValue={rating}
        counter={false}
        Color="#C49A6C"
        classname=""
      />
      <input type="hidden" id="rating" {...register("rating")} />
      {errors.rating && (
        <p className="text-red-600 text-sm mt-1">{errors.rating.message}</p>
      )}

      <textarea
        id="review"
        placeholder="رسالتك"
        className="rounded bg-[#000000] p-4 h-30 text-[#eeeeeeb5] focus:outline-none focus:ring-2 focus:ring-[#C49A6C] placeholder:text-[#eeeeeeb5]"
        {...register("review", {
          required: "الرجاء إدخال رسالتك",
          minLength: {
            value: 3,
            message: "الرسالة قصيرة جدًا (3 أحرف على الأقل)",
          },
          maxLength: {
            value: 300,
            message: "الرسالة طويلة جدًا (300 حرف كحد أقصى)",
          },
        })}
      />

      {errors.review && (
        <p className="text-red-600 text-sm mt-1">{errors.review.message}</p>
      )}

      <button
        disabled={isLoading}
        className="bg-[#C49A6C] hover:bg-[#b18659] transition text-[#000] font-bold rounded p-2"
      >
        {isLoading ? "جاري الإرسال..." : "إرسال التقييم"}
      </button>
    </form>
  );
}

export default ReviewForm;
