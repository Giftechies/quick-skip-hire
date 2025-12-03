"use client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import OrderEdit from "./OrderEdit";

export default function Ordercomponent({ orderData }) {
    const [status, setStatus] = useState("");          // filter status
    const [orders, setOrders] = useState([]);          // all orders from API
    const route = useRouter()

    useEffect(() => {
        setOrders(orderData.data || []);
    }, []);

    const Dateformate = (date,pattern='dd MMM yyyy')=>{
        if(!date) return "N/A"
        const parse = new Date(date)
        if(isNaN(parse.getTime())) return "N/A"
        return format(parse,pattern)
    }

    // 2) Compute counts dynamically from orders (never manually increment)
    const counts = useMemo(() => {
        let result = { new: 0, processing: 0, complete: 0 };

        orders.forEach(o => {
            const s = o.adminOrderStatus?.trim().toLowerCase();
            if (s === "new") result.new++;
            if (s === "processing") result.processing++;
            if (s === "complete") result.complete++;
        });

        return result;
            
    }, [orders]);

    // 3) Compute filtered list based on selected status
    const filteredOrders = useMemo(() => {
        if (!status) return orders; // when clicking nothing → show all

        return orders.filter(o =>
            o.adminOrderStatus?.trim().toLowerCase() === status
        );
    }, [orders, status]);

    const statusBoxes = [
        { label: "new", count: counts.new },
        { label: "processing", count: counts.processing },
        { label: "complete", count: counts.complete },
    ];

    const onStatusUpdate = (id,newstatus)=>{
        setOrders(prev=>prev.map((o)=>o._id ===id? {...o,adminOrderStatus:newstatus}:o))
    }

    return (
        <section className="p-4 md:p-8">

       {/* STATUS BOXES (MODERN LOOK) */}
<div className={`lg:px-16 px-6 grid grid-cols-3 gap-6 md:gap-12`}>
    {statusBoxes.map(box => (
        <div
            key={box.label}
            onClick={() => setStatus(box.label)}
            className={`
                bg-white border border-gray-200
                py-8 h-full rounded-xl flex flex-col items-center justify-center 
                cursor-pointer transition-all duration-300 transform
                
                // DEFAULT & HOVER STATES
                shadow-lg hover:shadow-xl hover:scale-[1.02] hover:border-blue-500
                
                // ACTIVE STATE
                ${box.label === status 
                    ? "bg-blue-50 ring-2 ring-blue-500 border-blue-500 text-blue-800" // Modern Active
                    : "text-gray-900 hover:bg-blue-50" // Default/Hover
                }
            `}
        >
            {/* LARGE COUNT */}
            <p className="text-4xl font-medium tracking-tight">
                {box.count}
            </p>
            {/* SUBTLE LABEL */}
            <p className={`
                mt-2 text-lg font-medium capitalize 
                ${box.label === status ? "text-blue-600" : "text-gray-500"}
            `}>
                {box.label}
            </p>
        </div>
    ))}
</div>
            <div onClick={() => setStatus(null)} className="flex justify-end mt-4" ><Button>Reset Filter</Button></div>

            {/* TABLE */}
            <div className="mt-8 px-4 min-h-[300px]">
                <Table className="table-fixed w-full">
                    <TableHeader>
                        <TableRow className="capitalize">
                            <TableHead>Order Id</TableHead>
                            <TableHead>Customer Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Delivery Date</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody >
                        {filteredOrders?.map((o) => (
                            <TableRow key={o._id}>
                                <TableCell className="truncate max-w-[180px]" >{o?._id} </TableCell>
                                <TableCell className="truncate max-w-[180px]">{o?.customer?.email}</TableCell>
                                <TableCell className={'capitalize truncate max-w-[180px]'} >{o.adminOrderStatus}</TableCell>
                                <TableCell className={'capitalize truncate max-w-[180px]'}>{Dateformate(o.deliveryDate)}</TableCell>
                                <TableCell>£ {o?.totalamount}</TableCell>
                                <TableCell className="flex gap-4">
                                    <Button className={'cursor-pointer'} onClick={() => route.push(`/quick-skip/admin/orders/view/${o._id}`)} variant="secondary"><Eye /></Button>
                                  <OrderEdit id={o._id} existStatus={o?.adminOrderStatus} onStatusUpdate={onStatusUpdate} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </section>
    );
}
