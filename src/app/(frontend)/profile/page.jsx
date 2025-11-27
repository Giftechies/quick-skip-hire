import ProfileComponent from "@/components/Profile/ProfileComponent"
import Innerbanner from "@/components/sharedUi/Innerbanner"
import { getuserDetails } from "@/lib/auth";



export default async function profilePage() {
    const user =await getuserDetails();
    console.log(user<"dddd>");
    return(
      <>
      <Innerbanner pagename={'Profile'} />
      <ProfileComponent/>
      
      
      </>
    )
}