"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

export default function Cart() {
  const { watch,setValue } = useFormContext();
  const skipsize = watch("skipSize") || {};
  const extras = watch("extras") || {};

  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    // calculate total whenever skipSize or extras changes
    const extrasTotal = Object.values(extras).reduce(
      (sum, item) => sum + item.qty * item.price,
      0
    );

    const roll = "roll and roll off"; // fixed typo: you had "oll and roll off"
    let sub = (skipsize?.rate || 0) + extrasTotal;

    // (optional) if you want specific logic when roll and roll off
    if (skipsize.label?.trim()?.toLowerCase() === roll.trim().toLowerCase()) {
      console.log("Roll and roll off selected");
      sub = (skipsize?.rate || 0) + extrasTotal;
    }

    setSubtotal(sub);
  }, [skipsize, extras]); // ✅ runs only when these change

  // VAT 20%
  const vat = subtotal * 0.2;

  // Final total
  const total = subtotal + vat;

useEffect(() => {
  setValue("totalamount", total); // 🔥 sync total → form
}, [total, setValue]);

  return (
       <section>
      <h6 className="h5 text-center">
        <span className="font-semibold text-primary">Step 5: </span>Your Cart
      </h6>

      <div className="shadow max-w-120 mx-auto mt-8 flex flex-col gap-4 p-6">
        {/* Job Type Row */}
        <div className="flex justify-between gap-8">
          <div className="logo  size-20 shrink-0  border rounded-full overflow-hidden">
            <Image
              height={100}
              width={100}
              alt="logo"
              src={"/truck.jpg"}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="flex flex-col flex-1 justify-between items-center">
            <h3 className="h4  text-black-2 font-semibold text-center">
              Skip-{skipsize?.size}
            </h3>
            <div className="w-full flex justify-end" ><span>£{skipsize?.rate || 0}</span></div>
          </div>
        </div>

        {/* Extras */}
        <div className="w-full flex flex-col gap-4 h6 font-semibold">
          { extras && <label className=" "  > Extra </label>}
          <div>
            {Object.entries(extras).map(([id, data]) => (
              <label key={id} className="flex  justify-between gap-8">
                <span className="w-44 block text-gray-500 text-[14px]">{id}</span>
                <span className="block flex-1 text-gray-500 text-[14px] " >
                  {data.qty} × £{data.price}
                </span>
                <span className="block ">£{data.qty * data.price}</span>
              </label>
            ))}
            
          </div>

          {/* Totals */}
          <label className="flex justify-between">
            <span className="text-gray-500 text-[14px]">Subtotal</span>
            <span>£{subtotal?.toFixed(2)}</span>
          </label>

          <label className="flex justify-between">
            <span className="text-gray-500 text-[14px]">VAT 20%</span>
            <span>£{vat.toFixed(2)}</span>
          </label>

          <label className="flex justify-between">
            <span className="text-gray-500 text-[14px]">Total</span>
            <span>£{total.toFixed(2)}</span>
          </label>
        </div>
      </div>
    </section>
  );
}
