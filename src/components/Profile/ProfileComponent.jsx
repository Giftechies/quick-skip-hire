"use client"
import { useEffect, useState } from "react"
import ProfileSideBar from "./ProfileSideBar"
import Orders from "./Orders"
import MyProfile from "./MyProfile"
import { ProfileFetch } from "@/app/apiCalls/form"

export default function ProfileComponent({ id }) {

    const getUserDetail = async () => {
        const user = await ProfileFetch({ id })
        setuser(user.data)
    }
    const [currentStep, setCurrentStep] = useState(0)
    const [user, setuser] = useState()
    const components = [
        { label: "My Profile", component: <MyProfile  user={user} getUserDetail={getUserDetail}  /> },
        { label: "Orders", component: <Orders id={id} /> },
    ]


    useEffect(() => {
        getUserDetail();
    }, [])

    return (
        <section className="container p-0!   my-8" >
            <main className="flex gap-8 relative  " >
                <ProfileSideBar user={user} components={components} currentStep={currentStep} SetcurrentStep={setCurrentStep} />
                <div className="  h-250 w-full p-6 " >
                    {components[currentStep].component}
                </div>
            </main>


        </section>
    )
}