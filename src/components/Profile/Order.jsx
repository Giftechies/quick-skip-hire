'use client'
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { fetchAllOrders } from "@/app/apiCalls/form";
import { Eye } from "lucide-react";
import { format } from "date-fns";



export default function Order({ id }) {
    const [orders, setOrders] = useState([]);
    const fetchAllorder = async () => {
        const res = await fetchAllOrders(id);
        console.log("Orders fetched:", res);
        setOrders(res.data);
    }
    useEffect(() => {
        fetchAllorder();
    }, [])
    return (
        <div>
            <h5 className="h4 font-semibold " >Order History</h5>
            <Table>
                <TableHeader>
                    <TableRow>
                        {orderHeaders?.map((headers, idx) => (
                            <TableHead key={idx} >
                                <span>{headers}</span>
                            </TableHead>
                        ))}

                    </TableRow>
                </TableHeader>

                <TableBody>
                    {orders?.map((order, idx) => (
                        <TableRow>
                            <TableCell key={idx} >
                                <span>{order._id}</span>
                            </TableCell>
                            <TableCell>
                                <span>{Dateformate(order.deliveryDate)}</span>
                            </TableCell>
                            <TableCell>
                                <span className="capitalize" >{order.adminOrderStatus.toLowerCase()!=="delevired"?"Processing":"Done" || "N/A"}</span>
                            </TableCell>
                            <TableCell>
                                <span>${order.totalamount || "0.00"}</span>
                            </TableCell>
                            <TableCell className={''} >
                                <Eye className="w-4 h-4 cursor-pointer text-indigo-500" />
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}


const orderHeaders = ["Order ID", "Delivery Date", "Status", "Total Amount", "Action"];

// Example date formatting function
const Dateformate = (dateString,pattern="dd MMM, yyyy") => {
    if (!dateString) return "N/A";
    const data = new Date(dateString);
    if (isNaN(data.getTime())) return "N/A";
    return format(data, pattern);
}
