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

export default function OrderEdit({id}){
    return(
        <Dialog>
            <DialogTrigger>
                 <Button className={'cursor-pointer'} variant="secondary"><Edit /></Button>
            </DialogTrigger>
            <DialogContent>
                <div>
                    <h3 className="h4 font-medium" >Update status</h3>
                <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
                </div>
            </DialogContent>
        </Dialog>

    )
}