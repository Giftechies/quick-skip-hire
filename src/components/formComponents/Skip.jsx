"use client";
import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import Cardskip from "./Cardskip";
import { Skipcard } from "./Skipcard";
import { Skeleton } from "../ui/skeleton";
import { LoaderCircle } from "lucide-react";

export default function Skip({ goToNextStep }) {
  const { watch, setValue } = useFormContext();
  const type = watch("jobType");
  const postcode = watch("postcodeArea");
  const selectedSkip = watch("skipSize");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false); // ✅ Added loader state

  useEffect(() => {
    if (!type || !postcode) return;

    async function fetchData() {
      setLoading(true); // ✅ start loading
      const res = await fetch(
        `/api/frontend/form?postcode=${postcode}&jobType=${type}`,
        { cache: "no-store" }
      );
      const json = await res.json();
      const response = json.data || [];

      let formatted = [];
      if (type?.trim()?.toLowerCase() === "roll and roll off") {
        formatted = response.map((item) => ({
          label: item.label,
          baseprice: item.baseprice,
          tones: item.tones,
          toneprice: item.toneprice,
        }));
      } else {
        formatted = response.map((item) => ({
          size: item.sizeId?.size,
          rate: item.rate,
        }));
      }

      setData(formatted);
      setLoading(false); // ✅ stop loading
    }

    fetchData();
  }, [type, postcode]);

  if (!type || !postcode) return null;

  const handleform = (selected) => {
    setValue("skipSize", selected);
    if (goToNextStep) goToNextStep();
  };

  return (
    <section className="  skip grid gap-8  justify-center md:grid-cols-2 lg:grid-cols-3 sm:px-8 lg:px-32">
      {loading
      ?
            <div className=" p-4 min-h-80 w-[16rem]  rounded-md " >
              <div className=" absolute inset-0  z-50 w-full bg-black/20 h-full flex  flex-col items-center justify-center " >
                    <LoaderCircle className="  animate-spin size-12  " />
                    Loading...
              </div>
            </div>
        : data.map((item, id) =>
            type === "roll and roll off" ? (
              <Skipcard
                key={id}
                item={item}
                setValue={setValue}
                onClick={() => handleform(item)}
              />
            ) : (
              <Cardskip
                key={id}
                item={item}
                isSelected={selectedSkip?.size === item.size}
                onClick={() => {
                  setValue("skipSize", item);
                  if (goToNextStep) goToNextStep();
                }}
              />
            )
          )}
    </section>
  );
}
