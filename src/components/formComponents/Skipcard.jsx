"use client";
import { Minus, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

export const Skipcard = ({ item, onClick, setValue }) => {
  const [tones, settones] = useState(item.tones);

  const substractTones = () => {
    if (tones > 5) settones((e) => e - 1);
  };

  const AddTones = () => {
    settones((e) => e + 1);
  };

  const totalprice = item.baseprice + item.toneprice * tones;

  // 🧠 Automatically update form whenever tones or price changes
  useEffect(() => {
    const updated = {
      size: item.label,
      rate: totalprice,
      tones: tones,
      baseprice: item.baseprice,
      toneprice: item.toneprice,
    };

    if (setValue) setValue("skipSize", updated);
  }, [tones, totalprice]);

  // ✅ Still trigger manually on Buy Now (optional)
  const handleBuy = () => {
    const selected = {
      size: item.label,
      rate: totalprice,
      tones,
      baseprice: item.baseprice,
      toneprice: item.toneprice,
    };

    if (setValue) setValue("skipSize", selected);
    if (onClick) onClick(selected);
  };

  return (
    <div className="min-h-[25rem] w-[18rem] rounded-xl shadow-md bg-white p-6">
      <div  onClick={handleBuy}  className="img mx-auto w-full cursor-pointer overflow-hidden rounded-3xl">
        <img
          src="/truck.jpg"
          alt=""
          className="transition-all duration-500 ease-in-out size-full object-cover object-center group-hover:scale-[1.1]"
        />
      </div>

      <div className="mt-4 flex flex-col items-center justify-center gap-4">
        <div>
          <span  onClick={handleBuy} className="h5 font-oswald  cursor-pointer font-semibold text-primary group-hover:text-white">
            {item.label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded gap-2 px-1 text-black-3 h6">
            <button onClick={substractTones} className="h-full border-r pr-1">
              <Minus size={15} />
            </button>
            <span>{tones}</span>
            <button onClick={AddTones} className="border-l pl-1">
              <Plus size={15} />
            </button>
          </div>
          <span className="h6">/Tones</span>
        </div>

        <div className="h6 rounded-full px-4 py-2 group-hover:text-white">
          <span>£</span>
          <span>{totalprice}</span>
          <span>(+ VAT)</span>
        </div>

        <button
          onClick={handleBuy}
          className="rounded-full bg-primary px-4 py-2 text-white group-hover:bg-white group-hover:text-primary"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};
