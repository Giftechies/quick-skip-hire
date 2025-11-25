"use client";
import React, { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
export default function Extra({EXTRAS}) {

  const { control } = useFormContext();
  const [isExtra, setIsExtra] = useState(EXTRAS);

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
               { EXTRAS.map((extra,id) => (
                  <div
                    key={id}
                    className="flex items-center justify-between rounded-lg border bg-gray-100 p-3 even:bg-white"
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