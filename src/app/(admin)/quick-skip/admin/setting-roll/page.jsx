"use client";

import { useEffect, useState } from "react";
import {
  Pencil,
  Trash,
  ChevronLeft,
  ChevronRight,
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

export default function RollAdminPage() {
  const [rates, setRates] = useState([]);

  // Form state
  const [newLabel, setNewLabel] = useState("");
  const [newBasePrice, setNewBasePrice] = useState("");
  const [newTones, setNewTones] = useState("");
  const [newTonePrice, setNewTonePrice] = useState("");

  // Edit form state
  const [editId, setEditId] = useState(null);
  const [editLabel, setEditLabel] = useState("");
  const [editBasePrice, setEditBasePrice] = useState("");
  const [editTones, setEditTones] = useState("");
  const [editTonePrice, setEditTonePrice] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  // --- Fetch Rates ---
  const fetchRates = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/form/settingroll");
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

  useEffect(() => {
    fetchRates();
  }, []);

  // --- Sorting ---
  const sortedRates = [...rates].sort((a, b) => {
    if (!sortConfig.key) return 0;
    let aValue, bValue;
    switch (sortConfig.key) {
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
    if (!newLabel || !newBasePrice || !newTones || !newTonePrice)
      return toast.error("All fields are required");

    setLoading(true);
    try {
      const res = await fetch("/api/form/settingroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: newLabel,
          baseprice: newBasePrice,
          tones: newTones,
          toneprice: newTonePrice,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Roll rate added successfully");
        setNewLabel("");
        setNewBasePrice("");
        setNewTones("");
        setNewTonePrice("");
        setIsOpen(false);
        fetchRates();
      } else toast.error(data.message || "Failed to add rate");
    } catch (err) {
      console.error(err);
      toast.error("Error adding rate");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    if (!editLabel || !editBasePrice || !editTones || !editTonePrice)
      return toast.error("All fields are required");

    setLoading(true);
    try {
      const res = await fetch(`/api/form/settingroll/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: editLabel,
          baseprice: editBasePrice,
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
      const res = await fetch(`/api/form/settingroll/${id}`, { method: "DELETE" });
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
              <input
                type="text"
                placeholder="Label"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Base Price"
                value={newBasePrice}
                onChange={(e) => setNewBasePrice(e.target.value)}
                className="p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder=" Minimum Tones"
                value={newTones}
                onChange={(e) => setNewTones(e.target.value)}
                className="p-2 border rounded"
                required
              />
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
              <th className="border p-2 cursor-pointer" onClick={() => handleSort("label")}>
                <div className="flex gap-2">Label <ArrowUpDown className="w-5" /></div>
              </th>
              <th className="border p-2 cursor-pointer" onClick={() => handleSort("baseprice")}>
                <div className="flex gap-2">Base Price <ArrowUpDown className="w-5" /></div>
              </th>
              <th className="border p-2 cursor-pointer" onClick={() => handleSort("tones")}>
                <div className="flex gap-2">Minimum Tones <ArrowUpDown className="w-5" /></div>
              </th>
              <th className="border p-2 cursor-pointer" onClick={() => handleSort("toneprice")}>
                <div className="flex gap-2">Tone Price <ArrowUpDown className="w-5" /></div>
              </th>
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: itemsPerPage }).map((_, idx) => (
                  <tr key={idx}>
                    <td colSpan={6}><Skeleton className="h-8 my-1 rounded" /></td>
                  </tr>
                ))
              : paginatedRates.map((r, idx) => (
                  <tr key={r._id}>
                    <td className="border p-2">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                    <td className="border p-2">{r.label}</td>
                    <td className="border p-2">{r.baseprice}</td>
                    <td className="border p-2">{r.tones}</td>
                    <td className="border p-2">{r.toneprice}</td>
                    <td className="border p-2 flex justify-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditId(r._id);
                          setEditLabel(r.label);
                          setEditBasePrice(r.baseprice);
                          setEditTones(r.tones);
                          setEditTonePrice(r.toneprice);
                        }}
                      >
                        <Pencil size={18} />
                      </Button>
                      <Button variant="outline" onClick={() => handleDelete(r._id)}>
                        <Trash size={18} />
                      </Button>
                    </td>
                  </tr>
                ))}
            {!loading && paginatedRates.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
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
