//view/[id]/page.jsx

import { fetchSingleOrder } from "@/app/apiCalls/form";
import AdminOrderPreview from "@/components/admin/order/OrderView";

export default async function orderaPage({ params }) {
    const { id } = await params
    const order = await fetchSingleOrder(id)


    
    
    return (
        <>
        <AdminOrderPreview orderData={order.data} />
        </>
    )
}


