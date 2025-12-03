"use client";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Select, { components } from "react-select";
import { FetchpostCode } from "@/app/apiCalls/form";


export default function PostCode() {
  const [Ispostcode, setispostcode] = useState([]);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    setloading(true);
    async function data() {
      const res = await FetchpostCode();
      if (res) {
        setispostcode(res);
      }
      setloading(false);
    }
    data();
  }, []);

  const POSTCODE = [ "BR1", "BR2", "BR3", "BR4", "BR5", "BR6", "BR7", "BR8", "CR0", "CR2", "CR3", "CR4", "CR5", "CR6", "CR7", "CR8", "CR9", "DA1", "DA2", "DA3", "DA4", "DA5", "DA6", "DA7", "DA8", "DA9", "DA10", "DA11", "DA12", "DA13", "DA14", "DA15", "DA16", "DA17", "DA18", "E1", "E1W", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9", "E10", "E11", "E12", "E13", "E14", "E15", "E16", "E17", "E18", "EC", "EN1", "EN2", "EN3", "EN4", "EN5", "EN6", "EN7", "EN8", "EN9", "EN10", "EN11", "GU1", "GU2", "GU3", "GU4", "GU5", "GU6", "GU7", "GU8", "GU9", "GU10", "GU11", "GU12", "GU14", "GU15", "GU16", "GU17", "GU18", "GU19", "GU20", "GU21", "GU22", "GU23", "GU24", "GU25", "GU46", "GU47", "GU51", "GU52", "HA0", "HA1", "HA2", "HA3", "HA4", "HA5", "HA6", "HA7", "HA8", "HA9", "KT1", "KT2", "KT3", "KT4", "KT5", "KT6", "KT7", "KT8", "KT9", "KT10", "KT11", "KT12", "KT13", "KT14", "KT15", "KT16", "KT17", "KT18", "KT19", "KT20", "KT21", "KT22", "KT23", "KT24", "N1", "N2", "N3", "N4", "N5", "N6", "N7", "N8", "N9", "N10", "N11", "N12", "N13", "N14", "N15", "N16", "N17", "N18", "N19", "N20", "N21", "NW1", "NW2", "NW3", "NW4", "NW5", "NW6", "NW7", "NW8", "NW9", "NW10", "NW11", "RH1", "RH2", "RH3", "RH4", "RH5", "RH6", "RH7", "RH8", "RH9", "RH10", "RH11", "RH12", "RH13", "RH14", "RH15", "RH16", "RH17", "RH18", "RH19", "SE1", "SE2", "SE3", "SE4", "SE5", "SE6", "SE7", "SE8", "SE9", "SE10", "SE11", "SE12", "SE13", "SE14", "SE15", "SE16", "SE17", "SE18", "SE19", "SE20", "SE21", "SE22", "SE23", "SE24", "SE25", "SE26", "SE27", "SE28", "SL1", "SL2", "SL3", "SL4", "SL5", "SL6", "SL7", "SL8", "SL9", "SLO", "SM1", "SM2", "SM3", "SM4", "SM5", "SM6", "SM7", "SW1", "SW1A", "SW1P", "SW1V", "SW1W", "SW1X", "SW1Y", "SW2", "SW3", "SW4", "SW5", "SW6", "SW7", "SW8", "SW9", "SW10", "SW11", "SW12", "SW13", "SW14", "SW15", "SW16", "SW17", "SW18", "SW19", "SW20", "TN1", "TN2", "TN4", "TN9", "TN10", "TN11", "TN12", "TN13", "TN14", "TN15", "TN16", "TN23", "TN24", "TN26", "TN27", "TW1", "TW2", "TW3", "TW4", "TW5", "TW6", "TW7", "TW8", "TW9", "TW10", "TW11", "TW12", "TW13", "TW14", "TW15", "TW16", "TW17", "TW18", "TW19", "TW20", "UB1", "UB2", "UB3", "UB4", "UB5", "UB6", "UB7", "UB8", "UB9", "UB10", "UB11", "W1D", "W1G", "W1H", "W1J", "W1K", "W1U", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12", "W13", "W14", "WC", "WIT", ];

  const postcodeOptions =
    Ispostcode && Ispostcode.length > 0
      ? Ispostcode.map((item) => ({
          value: item.postcode,
          label: item.postcode,
        }))
      : POSTCODE.map((pc) => ({ value: pc, label: pc }));

  const CustomMenu = (props) => {
    const newInnerProps = {
      ...props.innerProps,
      "data-lenis-prevent": true,
      onWheel: (e) => e.stopPropagation(),
    };
    return <components.Menu {...props} innerProps={newInnerProps} />;
  };

  const CustomMenuList = (props) => {
    const newInnerProps = {
      ...props.innerProps,
      "data-lenis-prevent": true,
    };
    return <components.MenuList {...props} innerProps={newInnerProps} />;
  };

  const { control } = useFormContext();
// Only replace your return section with this:

return (
  <>
    <div className="w-full md:px-8 lg:px-16 xl:px-24">
      <h5 className="text-center text-lg sm:text-xl md:text-2xl font-semibold leading-snug">
        <span className="font-semibold text-primary">Step 1:</span> Select
        the postcode area where your skip will be delivered.
      </h5>

      <Controller
        name="postcodeArea"
        control={control}
        rules={{ required: "Please select a postcode" }}
        render={({ field, fieldState }) => {
          // *** NEW: use hardcoded list during loading ***
          const finalOptions = loading
            ? POSTCODE.map((pc) => ({ value: pc, label: pc }))
            : postcodeOptions;

          return (
            <div className="mt-6 flex flex-col items-center space-y-2">
              <label className="h6 block text-center font-bold">
                Postcode*
              </label>

              <div className="w-full max-w-[850px]">
                <Select
                  value={
                    field.value
                      ? { value: field.value, label: field.value }
                      : null
                  }
                  onChange={(option) => field.onChange(option?.value)}
                  options={finalOptions}
                  menuPosition="fixed"
                  menuShouldBlockScroll={true}
                  components={{
                    Menu: CustomMenu,
                    MenuList: CustomMenuList,
                  }}
                  classNames={{
                    menu: () =>
                      "bg-white shadow-lg border rounded-md z-[9999] tracking-wider w-full",
                    menuList: () =>
                      "max-h-48 p-4 overflow-y-scroll scrollbar-thin scrollbar-thumb-primary scrollbar-track-gray-200",
                    option: ({ isFocused, isSelected }) =>
                      `px-3 py-2 cursor-pointer tracking-wider ${
                        isSelected
                          ? "bg-primary/60 text-white"
                          : isFocused
                          ? "bg-gray-100"
                          : ""
                      }`,
                    singleValue: () =>
                      "tracking-wider text-primary font-semibold",
                  }}
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      borderRadius: ".5rem",
              
                      boxShadow: state.isFocused
                        ? "0 0 0 1px #ED7527"
                        : "none",
                      minHeight: 48,
                      width: "100%",
                      padding: "0 0.75rem",
                    }),
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    menuList: (provided) => ({
                      ...provided,
                      maxHeight: 200,
                      overflowY: "auto",
                      overscrollBehavior: "contain",
                      WebkitOverflowScrolling: "touch",
                    }),
                  }}
                />
              </div>

              {fieldState.error && (
                <p className="mt-2 text-sm text-red-500">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          );
        }}
      />
    </div>
  </>
);

}
