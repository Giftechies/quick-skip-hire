"use client";
import React, { useEffect, useState } from "react";
import { useForm, FormProvider, } from "react-hook-form";
import PostCode from "./Postcode";
import Extra from "./Extra";
import Cart from "./Cart";
import PostDetails from "./PostDetails";
import Skip from "./Skip";
import ProgressBar from "./ProgressBar";
import { useRouter } from "next/navigation";
import { Fetchjobtype, Fetchextra,FetchTimeSlots } from "@/app/apiCalls/form";

const BoonkingOnline = () => {
  // 🟢 Default form values
  const defaultValues = {
    postcodeArea: "",
    fullPostcode: "",
    deliveryDate: "",
    timeSlot: "",
    permitOnHighway: false,
    jobType: "",
    skipSize: [],
    extras: [],
    cart: [],
    customer: {
      name: "",
      phone: "",
      email: "",
      address: "",
    },
  };

  // let fetchextra =[]
  const [fetchjob, setfetchjob] = useState([]);
  const [fetchextra, setfetchextra] = useState([]);
  const [fetchedTimeSlots, setFetchedTimeSlots] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await Fetchjobtype();
      setfetchjob(res.data);

      const extrares = await Fetchextra();
      const fetchtime = await FetchTimeSlots();
      setFetchedTimeSlots(fetchtime.data);

    
      if (
        extrares.success &&
        Array.isArray(extrares.data) &&
        extrares.data.length > 0
      ) {
        setfetchextra(extrares.data);
      
      }
    })();
  }, []);

  const { register, handleSubmit } = useForm();
  const navigate = useRouter();
  const methods = useForm({ defaultValues });
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: "Postcode", component: <PostCode /> },
    { title: "Details", component: <PostDetails jobtype={fetchjob} slots={fetchedTimeSlots} /> },
    {
      title: "Skip Size",
      component: <Skip goToNextStep={() => setCurrentStep(currentStep + 1)} />,
    },
    { title: "Extras", component: <Extra EXTRAS={fetchextra} /> },
    { title: "Cart", component: <Cart /> },
   
  ];
  const nextStep = async () => {
    const isValid = await methods.trigger(); // for now: validate all fields
    const type = methods.watch("jobType");
    if (type.trim().toLowerCase() === "skip collection") {
      navigate.push("/collection"); // <-- redirects user
      return; // stop further steps
    }
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const onSubmit = (data) => {
    console.log("✅ Final submit:", data);
    // call API or payment gateway here
  };
  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="container  z-30  py-8   flex flex-col items-center gap-8 rounded-lg bg-white  shadow-md"
        >
          <h1 className="h2 title-animation text-center  font-oswald     ">
            Your Skip, Ready to Hire
          </h1>
          {/* Progress bar */}
          <ProgressBar
            className={"mt-6"}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            steps={steps}
          />

          {/* Render current step */}
          <div className="mx-auto mt-8  ">
            {steps[currentStep].component}
          </div>

          {/* Navigation buttons */}
          <div className="flex  justify-center gap-4 ">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={prevStep}
                className="rounded-full bg-primary px-4 py-2 text-white"
              >
                Previous
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className=" rounded-full bg-primary px-8 py-2 text-white"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className=" rounded-full bg-green-600 px-4 py-2 text-white"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default BoonkingOnline;
