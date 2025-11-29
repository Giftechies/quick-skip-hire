import ProfileComponent from "@/components/Profile/ProfileComponent"
import Innerbanner from "@/components/sharedUi/Innerbanner"
import { getuserDetails } from "@/lib/auth";



export default async function profilePage() {
    const user =  await getuserDetails();
    return(
      <>
      <Innerbanner pagename={'Profile'} />
      <ProfileComponent id={user?.userId}/>
      </>
    )
}