"use client";

import { useEffect, useState } from "react";
import {
  Pencil,
  Trash,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Check,
  ArrowUpDown,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export default function RollAdminPage() {
  const [rates, setRates] = useState([]);
  const [postcodes, setPostcodes] = useState([]);

  // Form state
  const [newRate, setNewRate] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newTones, setNewTones] = useState("");
  const [newTonePrice, setNewTonePrice] = useState("");
  const [selectedPostcode, setSelectedPostcode] = useState("");

  // Edit form state
  const [editId, setEditId] = useState(null);
  const [editRate, setEditRate] = useState("");
  const [editLabel, setEditLabel] = useState("");
  const [editTones, setEditTones] = useState("");
  const [editTonePrice, setEditTonePrice] = useState("");
  const [editPostcode, setEditPostcode] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  // Popover/Search
  const [postcodeQuery, setPostcodeQuery] = useState("");
  const [editPostcodeQuery, setEditPostcodeQuery] = useState("");
  const [postPopoverOpen, setPostPopoverOpen] = useState(false);
  const [editPostPopoverOpen, setEditPostPopoverOpen] = useState(false);

  // --- Fetch Rates ---
  const fetchRates = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/form/rollandroll");
      const data = await res.json();
      if (data.success) setRates(data.data);
      else toast.error(data.message || "Failed to fetch rates");
    } catch (err) {
      console.error(err);
      toast.error("Error fetching rates");
    } finally {
      setLoading(false);
    }
  };

  // --- Fetch Postcodes ---
  const fetchPostcodes = async () => {
    try {
      const res = await fetch("/api/form/postcode");
      const data = await res.json();
      
      
      if (data) setPostcodes(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRates();
    fetchPostcodes();
  }, []);

  // --- Sorting ---
  const sortedRates = [...rates].sort((a, b) => {
    if (!sortConfig.key) return 0;
    let aValue, bValue;

    switch (sortConfig.key) {
      case "postcode":
        aValue = a.postId?.postcode || "";
        bValue = b.postId?.postcode || "";
        break;
      case "label":
        aValue = a.label || "";
        bValue = b.label || "";
        break;
      case "baseprice":
        aValue = Number(a.baseprice) || 0;
        bValue = Number(b.baseprice) || 0;
        break;
      case "tones":
        aValue = Number(a.tones) || 0;
        bValue = Number(b.tones) || 0;
        break;
      case "toneprice":
        aValue = Number(a.toneprice) || 0;
        bValue = Number(b.toneprice) || 0;
        break;
      default:
        return 0;
    }
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  // --- Pagination ---
  const totalPages = Math.ceil(sortedRates.length / itemsPerPage);
  const paginatedRates = sortedRates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // --- CRUD Operations ---
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!selectedPostcode || !newLabel || !newRate || !newTones || !newTonePrice)
      return toast.error("All fields are required");

    setLoading(true);
    try {
      const res = await fetch("/api/form/rollandroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: selectedPostcode,
          label: newLabel,
          baseprice: newRate,
          tones: newTones,
          toneprice: newTonePrice,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Roll rate added successfully");
        setNewRate("");
        setNewLabel("");
        setNewTones("");
        setNewTonePrice("");
        setSelectedPostcode("");
        fetchRates();
        setIsOpen(false);
      } else toast.error(data.message || "Failed to add rate");
    } catch (err) {
      console.error(err);
      toast.error("Error adding rate");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    if (!editPostcode || !editLabel || !editRate || !editTones || !editTonePrice)
      return toast.error("All fields are required");

    setLoading(true);
    try {
      const res = await fetch(`/api/form/rollandroll/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: editPostcode,
          label: editLabel,
          baseprice: editRate,
          tones: editTones,
          toneprice: editTonePrice,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Roll rate updated successfully");
        setEditId(null);
        fetchRates();
      } else toast.error(data.message || "Failed to update rate");
    } catch (err) {
      console.error(err);
      toast.error("Error updating rate");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this roll rate?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/form/rollandroll/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) toast.success("Roll rate deleted successfully");
      else toast.error(data.message || "Failed to delete rate");
      fetchRates();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting rate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-6 border border-gray-200">
      <Toaster position="top-right" />
      <h1 className="mb-4 text-2xl font-bold">Roll-on-Roll-off Rate Management</h1>

      {/* Add Rate Dialog */}
      <div className="flex justify-end mb-4">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="text-white">Add New Roll Rate</Button>
          </DialogTrigger>
          <DialogOverlay className="fixed inset-0 bg-black/50" />
          <DialogContent className="w-[90%] md:w-[500px] p-4 rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-center">Create Roll Rate</DialogTitle>
            </DialogHeader>
            <form className="flex flex-col gap-3 mt-2" onSubmit={handleCreate}>
              {/* Postcode */}
              <select
                required
                value={selectedPostcode}
                onChange={(e) => setSelectedPostcode(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">Select Postcode</option>
                {postcodes.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.postcode}
                  </option>
                ))}
              </select>

              {/* Label */}
              <input
                type="text"
                placeholder="Label"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="p-2 border rounded"
                required
              />
              {/* Baseprice */}
              <input
                type="number"
                placeholder="Base Price"
                value={newRate}
                onChange={(e) => setNewRate(e.target.value)}
                className="p-2 border rounded"
                required
              />
              {/* Tones */}
              <input
                type="number"
                placeholder="Tones"
                value={newTones}
                onChange={(e) => setNewTones(e.target.value)}
                className="p-2 border rounded"
                required
              />
              {/* Tone Price */}
              <input
                type="number"
                placeholder="Tone Price"
                value={newTonePrice}
                onChange={(e) => setNewTonePrice(e.target.value)}
                className="p-2 border rounded"
                required
              />

              <button
                type="submit"
                className="bg-primary text-white p-2 rounded"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Roll Rate"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border p-2 w-[5%]">#</th>
              <th
                className="border p-2 cursor-pointer"
                onClick={() => handleSort("postcode")}
              >
                <div className="flex gap-2">
                  Postcode <ArrowUpDown className="w-5" />
                </div>
              </th>
              <th
                className="border p-2 cursor-pointer"
                onClick={() => handleSort("label")}
              >
                <div className="flex gap-2">
                  Label <ArrowUpDown className="w-5" />
                </div>
              </th>
              <th
                className="border p-2 cursor-pointer"
                onClick={() => handleSort("baseprice")}
              >
                <div className="flex gap-2">
                  Base Price <ArrowUpDown className="w-5" />
                </div>
              </th>
              <th
                className="border p-2 cursor-pointer"
                onClick={() => handleSort("tones")}
              >
                <div className="flex gap-2">
                  Minimum Tones <ArrowUpDown className="w-5" />
                </div>
              </th>
              <th
                className="border p-2 cursor-pointer"
                onClick={() => handleSort("toneprice")}
              >
                <div className="flex gap-2">
                  Tone Price <ArrowUpDown className="w-5" />
                </div>
              </th>
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: itemsPerPage }).map((_, idx) => (
                  <tr key={idx}>
                    <td colSpan={7}>
                      <Skeleton className="h-8 my-1 rounded" />
                    </td>
                  </tr>
                ))
              : paginatedRates.map((r, idx) => (
                  <tr key={r._id}>
                    <td className="border p-2">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                    <td className="border p-2">{r.postId?.postcode}</td>
                    <td className="border p-2">{r.label}</td>
                    <td className="border p-2">{r.baseprice}</td>
                    <td className="border p-2">{r.tones}</td>
                    <td className="border p-2">{r.toneprice}</td>
                    <td className="border p-2 flex justify-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditId(r._id);
                          setEditPostcode(r.postId?._id || "");
                          setEditLabel(r.label);
                          setEditRate(r.baseprice);
                          setEditTones(r.tones);
                          setEditTonePrice(r.toneprice);
                        }}
                      >
                        <Pencil size={18} />
                      </Button>
                      <Button variant="destructive" onClick={() => handleDelete(r._id)}>
                        <Trash size={18} />
                      </Button>
                    </td>
                  </tr>
                ))}
            {!loading && paginatedRates.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No roll rates found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        <Button variant="outline" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          <ChevronLeft />
        </Button>
        {[...Array(totalPages)].map((_, idx) => (
          <Button
            className="text-white"
            key={idx}
            variant={currentPage === idx + 1 ? "default" : "outline"}
            onClick={() => goToPage(idx + 1)}
          >
            {idx + 1}
          </Button>
        ))}
        <Button variant="outline" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
          <ChevronRight />
        </Button>
      </div>
    </section>
  );
}
