import { updateOrderStatus } from "@/app/apiCalls/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SelectItem, SelectTrigger,Select, SelectContent, SelectGroup, SelectValue, SelectLabel } from "@/components/ui/select";

import { Edit } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function OrderEdit({id,existStatus,onStatusUpdate}){
  const [ isOpen,setIsOpen] = useState(false)
  const [status,setstatus] = useState(existStatus || '')
  const updateHandler = async ()=>{
    
    const res = await updateOrderStatus(id,status)
    if(res.success){
      toast.success(res.message)
      setIsOpen(false)
      onStatusUpdate(id,status)
    }

  }
    return(
        <Dialog open={isOpen} onOpenChange={setIsOpen} >
            <DialogTrigger aschild >
                 <Button className={'cursor-pointer'} variant="secondary"><Edit /></Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>

                    <h3 className="h4 font-medium" >Update status</h3>
              </DialogTitle>
                <div className=" " >
                <Select value={status} onValueChange={setstatus} >
      <SelectTrigger className="w-[450px] my-4 ">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
    
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="processing">Processing</SelectItem>
          <SelectItem value="complete">Complete</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    <div onClick={updateHandler} className="flex justify-end" ><Button>Update</Button></div>
                </div>
            </DialogContent>
        </Dialog>

    )
}