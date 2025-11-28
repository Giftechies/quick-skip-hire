"use client"
import { useEffect, useState } from "react"
import ProfileSideBar from "./ProfileSideBar"
import Orders from "./Orders"
import MyProfile from "./MyProfile"
import { ProfileFetch } from "@/app/apiCalls/form"

export default  function ProfileComponent({id}){
  
    const [currentStep,setCurrentStep] = useState(0)
    const [user,setuser] = useState()
    const components = [
       {label:"My Profile",component: <MyProfile id={id} user={user} />},
       { label:"Orders",component:<Orders/>},
        
    ]

    useEffect(()=>{
     async function get(){
            const user = await ProfileFetch({id})
            console.log(user);
            setuser(user)
            
     }
     get()

    },[])
    // console.log(user,"user");
    return(
       <section className="container p-0!   my-8" >
        <main className="flex gap-8 relative  " >
            <ProfileSideBar  user={user} components={components} currentStep={currentStep} SetcurrentStep={setCurrentStep}  />
            <div className=" border-4 h-300 w-full p-6 " >
                {components[currentStep].component}
            </div>
        </main>


       </section>
    )
}