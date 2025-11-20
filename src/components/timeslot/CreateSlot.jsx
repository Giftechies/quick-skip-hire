"use client";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { PenBox } from "lucide-react";
import toast from "react-hot-toast";

export const CreateSlot = ({
  mode = "Create",
  initialData = null,
  label = "Create Time Slot",
  onSubmit,
}) => {

  // ----------------------------
  // NEW: Dialog Open State
  // ----------------------------
  const [open, setOpen] = useState(false);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [startSession, setStartSession] = useState("");
  const [endSession, setEndSession] = useState("");
  const [loading, setLoading] = useState(false);

useEffect(() => {
    if (initialData) {
      setStartTime(initialData.startTime || "");
      setEndTime(initialData.endTime || "");
      setStartSession(initialData.startSession || "");
      setEndSession(initialData.endSession || "");
    }
  }, [initialData]);

  const handleSubmit = async () => {
    const payload = { startTime, endTime, startSession, endSession };

    try {
      setLoading(true);

      const res = await onSubmit(payload);

      if (!res?.success) {
        toast.error(res?.error || `Failed to ${mode} time slot`);
        return;
      }

      toast.success(`Time slot ${mode}d successfully`);

      // Reset only on create
      if (mode === "Create") {
        setStartTime("");
        setEndTime("");
        setStartSession("");
        setEndSession("");
      }

      // ----------------------------
      // NEW: CLOSE THE DIALOG
      // ----------------------------
      setOpen(false);

    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    // -----------------------------------
    // NEW: Controlled Dialog
    // -----------------------------------
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-fit px-4 py-2">
          {mode === "Create" ? "Create Time Slot" : <PenBox className="h-4 w-4" />}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center">{label}</DialogTitle>
        </DialogHeader>

        <form className="flex flex-col gap-6 py-2">

          {/* ------------------- START TIME ------------------- */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Start Time</label>

              <Input
                type="time"
                placeholder="HH:MM"
                maxLength={5}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                step="1"
          defaultValue="10:30:"
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        
              />
            </div>

            <div className="w-32">
              <label className="text-sm font-medium">Session</label>
              <Select value={startSession} onValueChange={setStartSession}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="AM/PM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ------------------- END TIME ------------------- */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">End Time</label>

              <Input
                type="time"
                placeholder="HH:MM"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                step="1"
          defaultValue="10:30"
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        
              />
            </div>

            <div className="w-32">
              <label className="text-sm font-medium">Session</label>
              <Select value={endSession} onValueChange={setEndSession}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="AM/PM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>

        <div className="flex justify-end gap-3">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button disabled={loading} onClick={handleSubmit}>
            {loading ? "Saving..." : `${mode} Time Slot`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
