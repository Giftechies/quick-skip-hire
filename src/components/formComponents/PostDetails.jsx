"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Fetchjobtype } from "@/app/apiCalls/form";
import { Skeleton } from "@/components/ui/skeleton"; // ✅ added
import { Phone } from "lucide-react";

export default function PostDetails({jobtype=[]}) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const selected = watch("permitOnHighway");
  const selectedPostcode = watch("postcodeArea");

  const [loading, setLoading] = useState(false); // ✅ added loading state


  return (
    <div className="space-y-8 postdetails ">
      <h5 className="h5 text-center">
        <span className="font-semibold text-primary">Step 2:</span> Please
        Indicate your skip requirements below
      </h5>

      {/* Postcode + Date */}
      <div className="flex justify-between gap-8">
        {/* Full Postcode */}
        <div className="w-1/2">
          <label className="mb-2 block h6 text-primary font-semibold">
            Full Postcode
          </label>
          <div className="flex postcode overflow-hidden">
            <span className="top-[2.1rem] left-4 py-1 border-r-2 border-primary/50 pr-2">
              {selectedPostcode}
            </span>
            <input
              type="text"
              {...register("fullPostcode", {
                required: "Full postcode is required",
              })}
              className="text-black-4 font-medium tracking-wider px-2 placeholder-black-3/80 w-full"
              placeholder="E.g. SE1 2AB"
            />
          </div>
          {errors.fullPostcode && (
            <p className="text-center h6 text-red-400">
              {errors.fullPostcode.message}
            </p>
          )}
        </div>

        {/* Delivery Date */}
        <div className="w-1/2">
          <label className="mb-2 block h6 text-primary font-semibold">
            Delivery Date
          </label>
          <input
            type="date"
            {...register("deliveryDate", {
              required: "Delivery date is required",
            })}
            className="date py-3!"
            onFocus={(e) => e.target.showPicker?.()}
          />
          {errors.deliveryDate && (
            <p className="text-center h6 text-red-400">
              {errors.deliveryDate.message}
            </p>
          )}
        </div>
      </div>

      {/* Permit Section */}
      <div className="relative min-h-32 w-full rounded-3xl border-2 border-primary px-10 py-10">
        <span className="absolute -top-[1.3rem] left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-2 font-semibold text-white-1">
          Permit check
        </span>

        <span className="h5 mb-8 block font-semibold text-center">
          Will the skip be placed on a public highway?
        </span>

        <div className="flex flex-col items-center justify-center">
          <div className="flex gap-4">
            {/* Yes Option */}
            <label
              className={cn(
                "h6 rounded-full border-2 border-primary px-6 py-2 font-semibold",
                { "bg-primary/10 text-primary": selected === "Yes" }
              )}
            >
              <input
                type="radio"
                value="Yes"
                {...register("permitOnHighway", {
                  required: "Please select an option",
                })}
                className="mr-2 appearance-none w-3 h-3 border-2 border-primary rounded-full checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary transition"
              />
              Yes
            </label>

            {/* No Option */}
            <label
              className={cn(
                "h6 rounded-full border-2 border-primary px-6 py-2 font-semibold",
                { "bg-primary/10 text-primary": selected === "No" }
              )}
            >
              <input
                type="radio"
                value="No"
                {...register("permitOnHighway", {
                  required: "Please select an option",
                })}
                className="mr-2 appearance-none w-3 h-3 border-2 border-primary rounded-full checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary transition"
              />
              No
            </label>

          </div>
            {errors.permitOnHighway &&  <p className=" mt-2 text-red-600" >{errors.permitOnHighway.message}</p> }

          {selected === "Yes" && (
            <div className="w-[50%] bg-zinc-100 mt-8 rounded-lg p-6 font-semibold">
              <span className="font-medium">
                As your skip requires a licence to be kept on the road, please
                call the number below so we can get the correct information from
                you.
              </span>
              <a href="tel:#">
                <span className="text-primary flex gap-2 h4 mt-3 font-oswald">
                  <Phone size={35} />
                  1234657
                </span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Job Type Dropdown */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">Job Type</label>

        {loading ? (
          // ✅ Skeleton Loader
          <div className="flex flex-col gap-2">
            <Skeleton className="w-full h-10 rounded-full" />
            <Skeleton className="w-3/4 h-10 rounded-full" />
          </div>
        ) : (
          <select
            {...register("jobType", { required: "Job type is required" })}
            className="w-full rounded-full outline-none border tracking-wider px-4 focus:border-primary py-2"
          >
            <option value="">-- Select Job Type --</option>

            {jobtype && jobtype.length > 0
              ? jobtype.map((item) => (
                  <option key={item._id} value={item.category.toLowerCase()}>
                    {item.category}
                  </option>
                ))
              : // fallback options if API not loaded
                [
                  "Skip Delivery",
                  "Roll on Roll off",
                  "Skip Collection",
                  "Skip Exchange",
                  "Skip Wait and Load",
                  "Transit Waste Removal",
                ].map((label) => (
                  <option key={label} value={label.toLowerCase()}>
                    {label}
                  </option>
                ))}
          </select>
        )}

        {errors.jobType && (
          <p className="text-center h6 text-red-400 mt-2">
            {errors.jobType.message}
          </p>
        )}
      </div>
    </div>
  );
}
