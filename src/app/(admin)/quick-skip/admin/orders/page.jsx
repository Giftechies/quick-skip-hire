import { OrderAdmin } from "@/app/apiCalls/form";
import Ordercomponent from "@/components/admin/order/Ordercomponents";


export default async function Order(){
    const order = await OrderAdmin("")
    console.log(order,'or>>');
    
    return(
        <>
        <Ordercomponent orderData={order} />
        </>
    )
}