"use client"
import { useState } from "react"
import ProfileSideBar from "./ProfileSideBar"
import Orders from "./Orders"
import MyProfile from "./MyProfile"

export default   function ProfileComponent(){
  
    const [currentStep,setCurrentStep] = useState(0)
    const components = [
       {label:"My Profile",component: <MyProfile/>},
       { label:"Orders",component:<Orders/>},
        
    ]
    return(
       <section className="container border-2  my-8" >
        <main className="flex gap-6 relative" >
            <ProfileSideBar components={components} currentStep={currentStep} SetcurrentStep={setCurrentStep}  />
            <div className=" border-4 h-300" >d</div>
        </main>


       </section>
    )
}