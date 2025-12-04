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
import { Fetchjobtype, Fetchextra,FetchTimeSlots, createCheckoutSession } from "@/app/apiCalls/form";
import UserInfo from "./UserInfo";
import toast from "react-hot-toast";
import Image from "next/image";
import { Button } from "../ui/button";
import { UserCircleIcon } from "lucide-react";

const BoonkingOnline = () => {
  // 🟢 Default form values
  const defaultValues = {
    postcodeArea: "",
    fullPostcode: "",
    deliveryDate: "",
    timeSlot: "",
    permitOnHighway: false,
    jobType: "",
    skipSize: {},
    extras: {},
    totalamount: null,
    customer: {
      lastName: "",
      firstName: "",
      phoneNumber: "",
      email: "",
    },
  };

  // let fetchextra =[]
  const route = useRouter()
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

  // const { register, handleSubmit } = useForm();
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
    { title: "UserInfo", component: <UserInfo /> },
    { title: "Cart", component: <Cart /> },
   
  ];
  
  const nextStep = async () => {
    const permit = methods.watch("permitOnHighway")
    const isValid = await methods.trigger(); // for now: validate all fields
    const type = methods.watch("jobType");
    if (type.trim().toLowerCase() === "skip collection") {
      navigate.push("/collection"); // <-- redirects user
      return; // stop further steps
    }
    if(permit ==="Yes" && currentStep>0){
      toast.error("Not allowed.Please call us!")
      return;
  
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

  const onSubmit = async (data) => {
    console.log("Form Data Submitted: ", data);
   if(currentStep === steps.length-1 && data.totalamount !==null &&  data.totalamount !== 0){
    console.log("Final form data submitted: ", data);

  const result = await createCheckoutSession(data);
  console.log("session result>>>>>",result);
  

  if (result.success) {
    window.location.href = result.url;
  } else {
    toast.error("Payment session error :" + result.message);
  }


   }
};


  return (
    <div className="relative py-20 min-h-screen  " >
        <Image src={'/bgPic.webp'} width={250} height={250} alt="banner-pic" className="w-full h-full inset-0 absolute -z-20 object-center object-cover " />
        <div className="bg-[#0b1d54]/80 w-full absolute inset-0 -z-10" />

      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="container relative  z-30  py-8    flex flex-col items-center gap-8 rounded-lg  bg-white  shadow-md"
        >
               <div className=" z-30  top-3 container  mx-auto  bg-whit  flex justify-between items-center " >
                            <Image src={'/logo.png'} width={150}  height={10} className="h-24" alt="brand-logo" />
            
                          <Button onClick={()=>route.push("/profile")} className={'w-fit h-full cursor-pointer '} >
                              <UserCircleIcon className={'w-8 h-8 size-8 '} />
                          </Button>
                            </div>  
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
                className=" rounded-full bg-primaryblue px-4 py-2 text-white"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>

 
  );
};

export default BoonkingOnline;