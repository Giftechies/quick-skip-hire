"use client";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { fetchAllOrders } from "@/app/apiCalls/form";
import { Eye } from "lucide-react";
import { format } from "date-fns";

export default function Order({ id, setSelectedOrder }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAllorder = async () => {
        try {
            setLoading(true);
            const res = await fetchAllOrders(id);

            if (res?.success) {
                setOrders(res.data);
            } else {
                setOrders([]);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllorder();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h5 className="h4 font-semibold">Order History</h5>

            <Table>
                <TableHeader>
                    <TableRow>
                        {orderHeaders.map((header, idx) => (
                            <TableHead key={idx}>
                                <span>{header}</span>
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {orders.map((order) => {
                        const isDelivered =
                            order.adminOrderStatus?.toLowerCase() === "delivered";

                        return (
                            <TableRow key={order._id}>
                                <TableCell>{order._id}</TableCell>

                                <TableCell>{Dateformate(order.deliveryDate)}</TableCell>

                                <TableCell className="capitalize">
                                    {isDelivered ? "Done" : "Processing"}
                                </TableCell>

                                <TableCell>${order.totalamount || "0.00"}</TableCell>

                                <TableCell>
                                    <Eye
                                        onClick={() => setSelectedOrder(order)}
                                        className="w-4 h-4 cursor-pointer text-indigo-500"
                                    />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

const orderHeaders = ["Order ID", "Delivery Date", "Status", "Total Amount", "Action"];

const Dateformate = (date, pattern = "dd MMM, yyyy") => {
    if (!date) return "N/A";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "N/A";
    return format(d, pattern);
};
