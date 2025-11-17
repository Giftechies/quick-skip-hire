"use client";
import React, { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Fetchextra } from "@/app/apiCalls/form";
import { Skeleton } from "@/components/ui/skeleton";

export default function Extra({EXTRAS}) {

  
  const { control } = useFormContext();

//  const EXTRAS = [
//   { id: "adhesive_tins", label: "Adhesive Tins or Tubes", price: 30 },
//   { id: "armchair", label: "Armchair", price: 50 },
//   { id: "cookers", label: "Cookers", price: 50 },
//   { id: "dishwasher", label: "Dishwasher", price: 45 },
//   { id: "fire_extinguisher", label: "Fire Extinguisher", price: 25 },
//   { id: "footstools", label: "Footstools, Pouffes, Bean bags", price: 50 },
//   { id: "gas_bottle", label: "Gas Bottle", price: 80 },
//   { id: "large_fridge", label: "Large Fridge", price: 80 },
//   { id: "large_tyre", label: "Large Tyre", price: 50 },
//   { id: "mattress", label: "Mattress", price: 30 },
//   { id: "microwave", label: "Microwave", price: 25 },
//   { id: "pops_contaminated", label: "POPs Contaminated (Full load)", price: 250 },
//   { id: "paint_pots_empty", label: "Paint Pots (empty)", price: 0 },
//   { id: "paint_pots_full", label: "Paint Pots (full size)", price: 30 },
//   { id: "rubber_tracks", label: "Rubber Tracks", price: 50 },
//   { id: "scrap_conveyors", label: "Scrap Conveyors belts", price: 150 },
//   { id: "scrap_machine_track", label: "Scrap Machine Track", price: 175 },
//   { id: "small_fridge", label: "Small Fridge", price: 55 },
//   { id: "small_tyre", label: "Small Tyre", price: 15 },
//   { id: "tv", label: "TV", price: 55 },
//   { id: "sofa_three", label: "Three Seater Sofa", price: 100 },
//   { id: "sofa_two", label: "Two Seater Sofa", price: 75 },
//   { id: "washing_machine", label: "Washing machine", price: 40 },
// ];


  // 1. Initialize state with the hardcoded list for instant rendering
  const [isExtra, setIsExtra] = useState(EXTRAS);
  // We can remove the 'loading' state since we show data instantly,
  // but keeping it set to false for simplicity in this refactor.
  // const [loading, setLoading] = useState(false); 

  // useEffect(() => {
  //   async function loadExtra() {
  //     // Set loading to true while fetching (if you need to show an intermediate state)
  //     // setLoading(true); 
      
  //     const res = await Fetchextra();
      
  //     // If API data is successful and valid, replace the hardcoded list
  //     if (res.success && Array.isArray(res.data) && res.data.length > 0) {
  //       setIsExtra(res.data);
  //       console.log(res.data);
        
  //     }
      
  //     // setLoading(false);
  //   }
  //   loadExtra();
  // }, []); // Run only once on mount


  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">Step 4: Add Restricted Items</h2>
      <p className="mb-6 text-gray-600">
        Select any restricted items you need to dispose of. Prices are charged
        per item ( + VAT ).
      </p>

      <Controller
        name="extras"
        control={control}
        defaultValue={{}}
        render={({ field: { value = {}, onChange } }) => {
          const handleToggle = (extra, checked) => {
            if (!checked) {
              const updated = { ...value };
              // Use extra.label consistently
              delete updated[extra.label]; 
              onChange(updated);
            } else {
              onChange({
                ...value,
                [extra.label]: { qty: 1, price: extra.price },
              });
            }
          };

          const handleQuantityChange = (extra, qty) => {
            if (qty < 1) {
              const updated = { ...value };
              // Use extra.label consistently
              delete updated[extra.label]; 
              onChange(updated);
            } else {
              onChange({
                ...value,
                [extra.label]: { qty, price: extra.price },
              });
            }
          };

          return (
            <div
              data-lenis-prevent
              className="h-100 space-y-4 overflow-y-scroll p-4 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-primary"
            >
              
          
              {/* {loading && isExtra.length === 0 ? 
                Array.from({length:6}).map((_, i) => (
                  <div key={i} className="flex items-center justify-between w-full" >
                    <Skeleton className=" w-4 " />
                    <Skeleton className="w-full" />
                    <Skeleton className="w-5" />
                  </div>
                ))
              : */}
               { EXTRAS.map((extra,id) => (
                  <div
                    key={id}
                    className="flex items-center justify-between rounded-lg border bg-gray-100 p-3 even:bg-white-1"
                  >
                    {/* Checkbox + Label */}
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!value?.[extra.label]}
                        onChange={(e) => handleToggle(extra, e.target.checked)}
                      />
                      <span className="font-medium">
                        {extra.label}{" "}
                        <span className="text-gray-500">+ £{extra.price}</span>
                      </span>
                    </label>

                    {/* Quantity Controls */}
                    {value?.[extra.label] && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(extra, value[extra.label].qty - 1)
                          }
                          className="rounded bg-gray-300 px-2 text-white hover:bg-gray-200"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {value[extra.label].qty}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(extra, value[extra.label].qty + 1)
                          }
                          className="rounded bg-gray-300 px-2 text-white hover:bg-gray-200"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                ))
              }
            </div>
          );
        }}
      />
    </div>
  );
}