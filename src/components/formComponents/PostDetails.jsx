"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form"; // Added Controller for better Select handling
import { Skeleton } from "@/components/ui/skeleton";
import { Phone } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select"; // Ensure path matches your project

export default function PostDetails({ jobtype = [], slots = [] }) {
  const {
    register,
    watch,
    control, // Destructure control for easier Select management
    formState: { errors },
  } = useFormContext();
const [selectedPermit,setselectedPermit] = useState(watch("permitOnHighway") || '')
const [selectedPostcode,setselectedPostcode] = useState(watch("postcodeArea") || "")


  const [loading, setLoading] = useState(false);

  // Default fallback options if jobtype prop is empty
  const defaultJobTypes = [
    "Skip Delivery",
    "Roll on Roll off",
    "Skip Collection",
    "Skip Exchange",
    "Skip Wait and Load",
    "Transit Waste Removal",
  ];

  return (
    <div className="space-y-8 postdetails ">
      <h5 className="h5 text-center">
        <span className="font-semibold text-primary">Step 2:</span> Please
        Indicate your skip requirements below
      </h5>

      {/* Top Row: Postcode, Date, Time Slot (Using Grid for better layout) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. Full Postcode */}
        <div className="w-full">
          <label className="mb-2 block h6 text-primary font-semibold">
            Full Postcode
          </label>
          <div className="flex postcode overflow-hidden relative">
            {/* Postcode Area Prefix */}
            <div className="absolute left-0 top-0 bottom-0 flex items-center pl-3 pr-2 border-r-2 border-primary/50 pointer-events-none bg-transparent z-10">
              <span className="font-medium">{selectedPostcode}</span>
            </div>
            <input
              type="text"
              {...register("fullPostcode", {
                required: "Full postcode is required",
              })}
              className="pl-16 text-black font-medium tracking-wider px-2 placeholder-black-3/80 w-full py-2 border rounded-md"
              placeholder="2AB"
            />
          </div>
          {errors.fullPostcode && (
            <p className="text-sm mt-1 text-red-400">
              {errors.fullPostcode.message}
            </p>
          )}
        </div>

        {/* 2. Delivery Date */}
        <div className="w-full">
          <label className="mb-2 block h6 text-primary font-semibold">
            Delivery Date
          </label>
          <input
            type="date"
            {...register("deliveryDate", {
              required: "Delivery date is required",
            })}
            className="w-full border rounded-md px-3 py-2"
            onFocus={(e) => e.target.showPicker?.()}
          />
          {errors.deliveryDate && (
            <p className="text-sm mt-1 text-red-400">
              {errors.deliveryDate.message}
            </p>
          )}
        </div>

        {/* 3. Time Slot */}
        <div className="w-full">
          <label className="mb-2 block h6 text-primary font-semibold">
            Time slot
          </label>
          <Controller
            control={control}
            name="timeSlot"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a time slot" />
                </SelectTrigger>
                <SelectContent>
                  {slots?.length > 0 ? (
                    slots.map((slot, idx) => (
                      <SelectItem
                        key={idx}
                        value={`${slot.startTime}${slot.startSession} - ${slot.endTime}${slot.endSession}`}
                      >
                        {slot.startTime}{slot.startSession} - {slot.endTime}{slot.endSession}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="anytime" disabled>
                      No slots available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* Permit Section */}
      <div className="relative min-h-32 w-full rounded-3xl border-2 border-primary px-10 py-10 mt-12">
        <span className="absolute -top-[1.3rem] left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-2 font-semibold text-white">
          Permit check
        </span>

        <span className="h5 mb-8 block font-semibold text-center">
          Will the skip be placed on a public highway?
        </span>

        <div className="flex flex-col  items-center justify-center">
          <div className="flex gap-4">
            {/* Yes Option */}
            <label
              className={cn(
                "cursor-pointer h6 rounded-full border-2 border-primary px-6 py-2 font-semibold transition-colors",
                { "bg-primary/30 text-primary": selectedPermit === "Yes" }
              )}
            >
              <input
                type="radio"
                value="Yes"
                 onClick={()=>setselectedPermit("Yes")}
                {...register("permitOnHighway", {
                  required: "Please select an option",
                })}
                className="hidden" // Hidden because custom styling is on the label
              />
              Yes
            </label>

            {/* No Option */}
            <label
              className={cn(
                "cursor-pointer h6 rounded-full border-2 border-primary px-6 py-2 font-semibold transition-colors",
                { "bg-primary/30 text-primary": selectedPermit === "No" }
              )}
            >
              <input
                type="radio"
                onClick={()=>setselectedPermit("No")}
                value="No"
                {...register("permitOnHighway", {
                  required: "Please select an option",
                })}
                className="hidden"
              />
              No
            </label>
          </div>

          {errors.permitOnHighway && (
            <p className="mt-2 text-red-600">
              {errors.permitOnHighway.message}
            </p>
          )}

          {/* Logic: Show P Tag on Yes Click */}
          {selectedPermit === "Yes" && (
            <div className={cn("w-fit md:w-96 bg-zinc-100 mt-8 rounded-lg p-6  animate-in fade-in slide-in-from-top-2 h-0 transition-all duration-500 es ",{"h-40":selectedPermit==="Yes"})}>
              <p className="font-medium text-zinc-800">
                As your skip requires a licence to be kept on the road, please
                call the number below so we can get the correct information from
                you.
              </p>
              <a
                href="tel:1234657"
                className="inline-flex justify-center items-center gap-2 text-primary h5 mt-3 font-oswald hover:underline"
              >
                <Phone size={20} />
                1234657
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Job Type Section - Converted to Shadcn Select */}
      <div className="mb-4">
        <label className="mb-2 block h6 text-primary font-semibold">
          Job Type
        </label>

        {loading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="w-full h-10 rounded-full" />
          </div>
        ) : (
          <Controller
            control={control}
            name="jobType"
            rules={{ required: "Job type is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full rounded-full border-input px-4 py-6">
                  <SelectValue placeholder="-- Select Job Type --" />
                </SelectTrigger>
                <SelectContent>
                  {jobtype && jobtype.length > 0
                    ? jobtype.map((item) => (
                        <SelectItem
                          key={item._id}
                          value={item.category.toLowerCase()}
                        >
                          {item.category}
                        </SelectItem>
                      ))
                    : defaultJobTypes.map((label) => (
                        <SelectItem key={label} value={label.toLowerCase()}>
                          {label}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            )}
          />
        )}

        {errors.jobType && (
          <p className="text-red-500 mt-2 ml-2">{errors.jobType.message}</p>
        )}
      </div>
    </div>
  );
}