"use client"
import {  OrderAdmin } from "@/app/apiCalls/form";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useEffectEvent, useState } from "react";

export default function Ordercomponent() {
    const statusType = ['New', "pending", 'Delivered']
    const [status,setstatus] = useState("");
    const res =  OrderAdmin(status)
    console.log(res);
    
    

    return (
        <section className=" p-4 md:p-8 " >

            {/* stauts start */}
            <div className=" px-16 grid grid-cols-3 gap-12 " >
                {
                    statusType?.map((item, idx) => {

                        return (
                            <div onClick={()=>setstatus(item)} key={item} className=" border py-10 shadow flex flex-col items-center justify-center cursor-pointer " >
                                <h3 className="h5" >1</h3>
                                <h3 className="h6 capitalize "> {item}</h3>
                            </div>
                        )
                    })
                }
            </div>
            {/* status end */}

            <div className=" mt-8 px-4 " >
                <Table>
                    <TableHeader>
                        <TableRow className={' capitalize  '} >
                            <TableHead>Order Id</TableHead>
                            <TableHead>Customer Name</TableHead>
                            <TableHead>Status(Admin)</TableHead>
                            <TableHead>Status(Customer)</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>delo</TableCell>
                            <TableCell>delo</TableCell>
                            <TableCell>delo</TableCell>
                            <TableCell>delo</TableCell>
                            <TableCell>delo</TableCell>
                            <TableCell className={'flex gap-4'} >
                                <Button variant={'secondary'} className={'cursor-pointer  '} ><Eye/></Button>
                                <Button variant={"secondary"} className={'cursor-pointer  '} ><Edit /></Button>
                            </TableCell>
                        </TableRow>

                    </TableBody>

                </Table>
            </div>

        </section>
    )
}