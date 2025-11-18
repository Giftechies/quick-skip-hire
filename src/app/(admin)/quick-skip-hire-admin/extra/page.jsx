"use client";
import { useEffect, useState } from "react";
import {
  Pencil,
  Trash,
  ChevronLeft,
  ChevronRight,
  SearchIcon,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExtraPage() {
  const [extras, setExtras] = useState([]);
  const [newExtra, setNewExtra] = useState({ label: "", price: "" });
  const [editId, setEditId] = useState(null);
  const [editExtra, setEditExtra] = useState({ label: "", price: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [bulkMessage, setBulkMessage] = useState(null);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // ✅ Fetch extras safely
  const fetchExtras = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/form/extra", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const data = await res.json();

      // ✅ Ensure we always set an array
      const list = Array.isArray(data?.data || data)
        ? data.data || data
        : [];
      setExtras(list);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("⚠️ Failed to load extras. Please try again.");
      setExtras([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExtras();
  }, []);

  // ✅ Create Extra
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newExtra.label.trim() || !newExtra.price) {
      alert("⚠️ Please fill all fields.");
      return; 
    }

    setCreating(true);
    try {
      const res = await fetch("/api/form/extra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExtra),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Create failed");

      setNewExtra({ label: "", price: "" });
      setOpen(false);
      fetchExtras();
    } catch (err) {
      console.error("Create error:", err);
      alert(`❌ Failed to create extra: ${err.message}`);
    } finally {
      setCreating(false);
    }
  };

  // ✅ Update Extra
  const handleUpdate = async (id) => {
    if (!editExtra.label.trim() || !editExtra.price) {
      alert("⚠️ Fields cannot be empty.");
      return;
    }

    setUpdating(true);
    try {
      const res = await fetch(`/api/form/extra/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editExtra),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setEditId(null);
      setEditExtra({ label: "", price: "" });
      fetchExtras();
    } catch (err) {
      console.error("Update error:", err);
      alert(`❌ Update failed: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Delete Extra
  const handleDelete = async (id) => {
    if (!confirm("🗑️ Are you sure you want to delete this extra?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/form/extra/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");

      fetchExtras();
    } catch (err) {
      console.error("Delete error:", err);
      alert(`❌ Delete failed: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  // ✅ Bulk Upload
  const handleBulkUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/form/extra/bulk", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setBulkMessage({
          type: "success",
          text: `✅ Imported ${data.inserted || 0} items, skipped ${data.skipped?.length || 0}`,
        });
      } else {
        throw new Error(data.error || "Bulk upload failed");
      }

      fetchExtras();
      setOpen(false);
    } catch (err) {
      console.error("Bulk upload error:", err);
      setBulkMessage({
        type: "error",
        text: `❌ ${err.message}`,
      });
    } finally {
      setTimeout(() => setBulkMessage(null), 5000);
    }
  };

  // ✅ Safe Search Filter
  const filteredExtras = Array.isArray(extras)
    ? extras.filter((item) =>
        item.label?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredExtras.length / itemsPerPage));
  const paginatedExtras = filteredExtras.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <section className="p-6  border-gray-200 rounded-md">
      <h1 className="mb-4 text-2xl font-bold">Extra Management</h1>

      {/* ✅ Bulk Upload Toast */}
      {bulkMessage && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg text-white z-50 ${
            bulkMessage.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {bulkMessage.text}
        </div>
      )}

      {/* Search + Add + Bulk */}
      <div className="mb-6 flex flex-wrap justify-between items-center gap-2">
        <span className="rounded border p-2 w-96 flex items-center">
          <input
            type="text"
            placeholder="Search extras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full outline-none"
          />
          <SearchIcon />
        </span>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className=" text-white" >Add New Extra</Button>
          </DialogTrigger>
          <DialogOverlay className="fixed inset-0 bg-black/50" />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Extra</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="flex flex-col gap-3 mt-2">
              <input
                type="text"
                placeholder="Item Name"
                value={newExtra.label}
                onChange={(e) =>
                  setNewExtra({ ...newExtra, label: e.target.value })
                }
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Price"
                value={newExtra.price}
                onChange={(e) =>
                  setNewExtra({ ...newExtra, price: e.target.value })
                }
                className="border p-2 rounded"
              />
              <div className="flex gap-3 mt-4">
                <Button type="submit" disabled={creating} className="bg-primary text-white">
                  {creating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                    </>
                  ) : (
                    "Add"
                  )}
                </Button>
                <input
                  id="bulkFile"
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleBulkUpload}
                  className="hidden"
                />
                <label
                  htmlFor="bulkFile"
                  className="cursor-pointer bg-primary text-white rounded px-4 py-1 hover:bg-primary/80"
                >
                  Import Bulk
                </label>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 w-[10%] text-left">#</th>
            <th className="p-2 w-[45%] text-left">Label</th>
            <th className="p-2 w-[25%] text-left">Price</th>
            <th className="p-2 text-center w-[20%]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            [...Array(itemsPerPage)].map((_, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2"><Skeleton className="h-4 w-10" /></td>
                <td className="p-2"><Skeleton className="h-4 w-32" /></td>
                <td className="p-2"><Skeleton className="h-4 w-16" /></td>
                <td className="p-2 flex justify-center"><Skeleton className="h-6 w-6" /></td>
              </tr>
            ))
          ) : paginatedExtras.length > 0 ? (
            paginatedExtras.map((item, idx) => (
              <tr key={item._id || idx} className="border-t">
                <td className="p-2">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                <td className="p-2">
                  {editId === item._id ? (
                    <input
                      type="text"
                      value={editExtra.label}
                      onChange={(e) =>
                        setEditExtra({ ...editExtra, label: e.target.value })
                      }
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    item.label
                  )}
                </td>
                <td className="p-2">
                  {editId === item._id ? (
                    <input
                      type="number"
                      value={editExtra.price}
                      onChange={(e) =>
                        setEditExtra({ ...editExtra, price: e.target.value })
                      }
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    `£${item.price}`
                    // price symbol
                  )}
                </td>
                <td className="p-2 flex justify-center gap-8">
                  {editId === item._id ? (
                    <>
                      <Button
                        onClick={() => handleUpdate(item._id)}
                        disabled={updating}
                        className="bg-primary text-white"
                      >
                        {updating ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        onClick={() => setEditId(null)}
                        className="bg-primary text-white"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditId(item._id);
                          setEditExtra({
                            label: item.label,
                            price: item.price,
                          });
                        }}
                       
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        disabled={deletingId === item._id}
                        
                      >
                        {deletingId === item._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash size={18} />
                        )}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-500">
                No extras found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            <ChevronLeft />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1
                  ? "bg-primary text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </section>
  );
}
