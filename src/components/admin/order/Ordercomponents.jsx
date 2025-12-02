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
        let result = { new: 0, pending: 0, delivered: 0 };

        orders.forEach(o => {
            const s = o.adminOrderStatus?.trim().toLowerCase();
            if (s === "new") result.new++;
            if (s === "pending") result.pending++;
            if (s === "delivered") result.delivered++;
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
        { label: "pending", count: counts.pending },
        { label: "delivered", count: counts.delivered },
    ];

    return (
        <section className="p-4 md:p-8">

            {/* STATUS BOXES */}
            <div className="px-16 grid grid-cols-3 gap-12">
                {statusBoxes.map(box => (
                    <div
                        key={box.label}
                        onClick={() => setStatus(box.label)}
                        className="border py-10 shadow flex flex-col items-center cursor-pointer"
                    >
                        <h3 className="h5">{box.count}</h3>
                        <h3 className="h6 capitalize">{box.label}</h3>
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
                        {filteredOrders.map((o) => (
                            <TableRow key={o._id}>
                                <TableCell className="truncate max-w-[180px]" >{o._id} </TableCell>
                                <TableCell className="truncate max-w-[180px]">{o.customer.email}</TableCell>
                                <TableCell className={'capitalize truncate max-w-[180px]'} >{o.adminOrderStatus}</TableCell>
                                <TableCell className={'capitalize truncate max-w-[180px]'}>{Dateformate(o.deliveryDate)}</TableCell>
                                <TableCell>£ {o.totalamount}</TableCell>
                                <TableCell className="flex gap-4">
                                    <Button className={'cursor-pointer'} onClick={() => route.push(`/quick-skip/admin/orders/view/${o._id}`)} variant="secondary"><Eye /></Button>
                                   <OrderEdit/>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </section>
    );
}
