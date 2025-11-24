'use client';

import { useEffect, useState } from "react";
import { CreateTimeSlot, FetchTimeSlots, DeleteTimeSlot, UpdateTimeSlot } from "@/app/apiCalls/form";
import { CreateSlot } from "@/components/timeslot/CreateSlot";
import { Button } from "@/components/ui/button";

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";

import { Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function TimeslotAdminPage() {

  const [timeslots, setTimeslots] = useState([]);
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // GLOBAL LOADING MODAL
  // -----------------------------
  const LoadingOverlay = () => (
    <Dialog open={loading}>
      <DialogContent className="bg-transparent shadow-none border-none p-0">
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <Loader2 className="animate-spin w-6 h-6" />
            <p className="mt-2">Loading...</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // -----------------------------
  // FETCH ALL SLOTS
  // -----------------------------
  const loadSlots = async () => {
    try {
      setLoading(true);     // <-- show loader
      const res = await FetchTimeSlots();
      setTimeslots(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, []);

  // -----------------------------
  // CREATE
  // -----------------------------
  const CreateSlotHandler = async (payload) => {
    const res = await CreateTimeSlot(payload);
    await loadSlots();
    return res;
  };

  // -----------------------------
  // UPDATE
  // -----------------------------
  const UpdateSlotHandler = async (id, payload) => {
    const res = await UpdateTimeSlot(id, payload);
    await loadSlots();
    return res;
  };

  // -----------------------------
  // DELETE
  // -----------------------------
  const DeleteSlotHandler = async (id) => {
    try {
      setLoading(true);

      const res = await DeleteTimeSlot(id);

      if (!res.success) {
        throw new Error(res.error || "Failed to delete");
      }

      toast.success("Time slot deleted successfully");
      await loadSlots();

    } catch (error) {
      toast.error(error.message || "Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4">

      {/* GLOBAL LOADER */}
      <LoadingOverlay />

      {/* CREATE BUTTON */}
      <div className="flex justify-end">
        <CreateSlot mode="Create" label="Create Time Slot" onSubmit={CreateSlotHandler} />
      </div>

      <h1 className="text-2xl font-semibold">Time Slot Management</h1>

      {/* TABLE */}
      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Slots</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {timeslots.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">No time slots available.</TableCell>
              </TableRow>
            ) : (
              timeslots.map((slot, index) => (
                <TableRow key={slot._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{slot.startTime} {slot.startSession}</TableCell>
                  <TableCell>{slot.endTime} {slot.endSession}</TableCell>

                  <TableCell className="flex items-center gap-2">

                    {/* UPDATE BUTTON */}
                    <CreateSlot
                      mode="Update"
                      label="Update"
                      initialData={slot}
                      onSubmit={(data) => UpdateSlotHandler(slot._id, data)}
                    />

                    {/* DELETE */}
                    <Button
                      variant="outline"
                      onClick={() => DeleteSlotHandler(slot._id)}
                      disabled={loading}
                    >
                      <Trash2 className="text-red-500" />
                    </Button>

                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

    </div>
  );
}
