"use client"
import { useEffect, useState } from "react"
import ProfileSideBar from "./ProfileSideBar"
import Order from "./Order"
import MyProfile from "./MyProfile"
import { ProfileFetch } from "@/app/apiCalls/form"
import OrderView from "./OrdersView"
import { Loader2 } from "lucide-react"

export default function ProfileComponent({ id }) {

    const getUserDetail = async () => {
        const user = await ProfileFetch({ id })
        setuser(user.data)
    }
    const [currentStep, setCurrentStep] = useState(0)
    const [user, setuser] = useState()
    const [selectedOrder, setSelectedOrder] = useState(null);
    const components = [
        { label: "My Profile", component: <MyProfile user={user} getUserDetail={getUserDetail} /> },
        { label: "Orders", component: <Order id={id} setSelectedOrder={setSelectedOrder}  /> },
    ]


    useEffect(() => {
        getUserDetail();
    }, [])

    const Content = selectedOrder ? (<OrderView order={selectedOrder} setSelectedOrder={setSelectedOrder} />) : (components[currentStep].component)

    return (
        <section className="container p-0!   my-8" >
            <main className="flex gap-8 relative  " >
                
              {!user ? <div className="flex flex-col items-center justify-center w-full h-full" >
      <Loader2 className=" animate-spin text-black " />
      Loading...</div> :(<> <ProfileSideBar setSelectedOrder={setSelectedOrder}  user={user} components={components} currentStep={currentStep} SetcurrentStep={setCurrentStep} />
                <div className="  h-250 w-full p-6 " >
                    {Content}
                </div></>)}
               
            </main>
        </section>
    )
}