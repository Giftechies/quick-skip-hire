
import { OrderAdmin } from "@/app/apiCalls/form";
import Ordercomponent from "@/components/admin/order/Ordercomponents";

export const dynamic = "force-dynamic"
export default async function Order(){
    const order = await OrderAdmin("")
    console.log(order?.data,'or>>');
    
    return(
        <>
        <Ordercomponent orderData={order} />
        </>
    )
}