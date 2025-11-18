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

export default function SettingRatePage() {
  const [rates, setRates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);

  // Create form state
  const [newRate, setNewRate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  // Edit form state
  const [editId, setEditId] = useState(null);
  const [editRate, setEditRate] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editSize, setEditSize] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Sorting
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  // -------------------------------
  // 🔹 Fetch Setting Rates
  // -------------------------------
  const fetchRates = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/form/settingrate");
      const data = await res.json();
      if (data.success) setRates(data.data);
      else toast.error(data.message || "Failed to fetch rates");
    } catch (err) {
      console.error(err);
      toast.error("Error fetching setting rates");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // 🔹 Fetch Meta Data
  // -------------------------------
  const fetchMeta = async () => {
    try {
      const [catRes, sizeRes] = await Promise.all([
        fetch("/api/form/category"),
        fetch("/api/form/size"),
      ]);
      const [catData, sizeData] = await Promise.all([catRes.json(), sizeRes.json()]);
      if (catData.success) setCategories(catData.data);
      if (sizeData.success) setSizes(sizeData.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRates();
    fetchMeta();
  }, []);

  // -------------------------------
  // 🔹 Filter sizes by category
  // -------------------------------
  const filteredSizes = sizes.filter((s) => s.category?._id === selectedCategory);
  const filteredSizesEdit = sizes.filter((s) => s.category?._id === editCategory);

  // -------------------------------
  // 🔹 Sorting Logic
  // -------------------------------
  const sortedRates = [...rates].sort((a, b) => {
    if (!sortConfig.key) return 0;
    let aValue, bValue;

    switch (sortConfig.key) {
      case "category":
        aValue = a.categoryId?.category || "";
        bValue = b.categoryId?.category || "";
        break;
      case "size":
        aValue = a.sizeId?.size || "";
        bValue = b.sizeId?.size || "";
        break;
      case "rate":
        aValue = Number(a.rate) || 0;
        bValue = Number(b.rate) || 0;
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

  // -------------------------------
  // 🔹 Pagination
  // -------------------------------
  const totalPages = Math.ceil(sortedRates.length / itemsPerPage);
  const paginatedRates = sortedRates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // -------------------------------
  // 🔹 Create Rate
  // -------------------------------
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!selectedCategory || !selectedSize || !newRate)
      return toast.error("All fields are required");

    setLoading(true);
    try {
      const res = await fetch("/api/form/settingrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: selectedCategory,
          sizeId: selectedSize,
          rate: newRate,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Setting rate added successfully");
        setNewRate("");
        setSelectedCategory("");
        setSelectedSize("");
        setIsOpen(false);
        fetchRates();
      } else toast.error(data.message || "Failed to add rate");
    } catch (err) {
      console.error(err);
      toast.error("Error adding setting rate");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // 🔹 Update Rate
  // -------------------------------
  const handleUpdate = async (id) => {
    if (!editCategory || !editSize || !editRate)
      return toast.error("All fields are required");

    setLoading(true);
    try {
      const res = await fetch("/api/form/settingrate", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          categoryId: editCategory,
          sizeId: editSize,
          rate: editRate,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Setting rate updated successfully");
        setEditId(null);
        fetchRates();
      } else toast.error(data.message || "Failed to update");
    } catch (err) {
      console.error(err);
      toast.error("Error updating setting rate");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // 🔹 Delete Rate
  // -------------------------------
  const handleDelete = async (id) => {
    if (!confirm("Delete this setting rate?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/form/settingrate?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) toast.success("Deleted successfully");
      else toast.error(data.message || "Delete failed");
      fetchRates();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting setting rate");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // 🔹 Bulk Upload
  // -------------------------------
  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/form/settingrate/bulk", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        toast.success(`✅ Imported ${data.inserted} items`);
        fetchRates();
        setIsOpen(false);
      } else toast.error(`❌ ${data.message || "Bulk upload failed"}`);
    } catch (err) {
      console.error(err);
      toast.error("Error uploading file");
    } finally {
      setLoading(false);
      e.target.value = null;
    }
  };

  return (
    <section className="p-6 border border-gray-200">
      <Toaster position="top-right" />
      <h1 className="mb-4 text-2xl font-bold">Setting Rate Management</h1>

      {/* Add Setting Rate Dialog */}
      <div className="flex justify-end">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="text-white mb-4">Add New Setting Rate</Button>
          </DialogTrigger>
          <DialogOverlay className="fixed inset-0 bg-black/50" />
          <DialogContent className="w-[90%] md:w-[500px] p-4 rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-center">Create New Setting Rate</DialogTitle>
            </DialogHeader>

            <form className="flex flex-col gap-3 mt-2" onSubmit={handleCreate}>
              {/* Category */}
              <select
                required
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSize("");
                }}
                className="p-2 border rounded"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.category}
                  </option>
                ))}
              </select>

              {/* Size */}
              <select
                required
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">Select Size</option>
                {filteredSizes.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.size}
                  </option>
                ))}
              </select>

              {/* Rate Input */}
              <input
                type="number"
                placeholder="Enter Rate"
                value={newRate}
                onChange={(e) => setNewRate(e.target.value)}
                className="p-2 border rounded"
              />

              {/* Buttons */}
              <div className="flex items-center justify-center gap-2 mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-white p-2 rounded disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add Rate"}
                </button>

                <input
                  id="bulkFile"
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  className="hidden"
                  onChange={handleBulkUpload}
                />
                {/* <label
                  htmlFor="bulkFile"
                  className="cursor-pointer bg-primary text-white rounded px-4 py-2 hover:bg-primary/80"
                >
                  Import Bulk
                </label> */}
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editId} onOpenChange={() => setEditId(null)}>
        <DialogContent className="w-[90%] md:w-[500px] p-4 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-center">Edit Setting Rate</DialogTitle>
          </DialogHeader>

          <form
            className="flex flex-col gap-3 mt-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate(editId);
            }}
          >
            {/* Category */}
            <select
              required
              value={editCategory}
              onChange={(e) => {
                setEditCategory(e.target.value);
                setEditSize("");
              }}
              className="p-2 border rounded"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.category}
                </option>
              ))}
            </select>

            {/* Size */}
            <select
              required
              value={editSize}
              onChange={(e) => setEditSize(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">Select Size</option>
              {filteredSizesEdit.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.size}
                </option>
              ))}
            </select>

            {/* Rate */}
            <input
              type="number"
              placeholder="Enter Rate"
              value={editRate}
              onChange={(e) => setEditRate(e.target.value)}
              className="p-2 border rounded"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white p-2 rounded disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Rate"}
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Table */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border p-2 w-[5%]">#</th>
              <th
                className="border p-2 cursor-pointer"
                onClick={() => handleSort("category")}
              >
                <div className="flex gap-2">Category <ArrowUpDown className="w-5" /></div>
              </th>
              <th
                className="border p-2 cursor-pointer"
                onClick={() => handleSort("size")}
              >
                <div className="flex gap-2">Size <ArrowUpDown className="w-5" /></div>
              </th>
              <th
                className="border p-2 cursor-pointer"
                onClick={() => handleSort("rate")}
              >
                <div className="flex gap-2">Rate <ArrowUpDown className="w-5" /></div>
              </th>
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: itemsPerPage }).map((_, idx) => (
                  <tr key={idx}>
                    <td colSpan={5}>
                      <Skeleton className="h-8 my-1 rounded" />
                    </td>
                  </tr>
                ))
              : paginatedRates.map((r, idx) => (
                  <tr key={r._id}>
                    <td className="border p-2">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="border p-2">{r.categoryId?.category}</td>
                    <td className="border p-2">{r.sizeId?.size}</td>
                    <td className="border p-2">{r.rate}</td>
                    <td className="border p-2 flex justify-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditId(r._id);
                          setEditCategory(r.categoryId?._id || "");
                          setEditSize(r.sizeId?._id || "");
                          setEditRate(r.rate);
                        }}
                      >
                        <Pencil size={18} />
                      </Button>
                      <Button
                        variant="Outline"
                        onClick={() => handleDelete(r._id)}
                      >
                        <Trash size={18} />
                      </Button>
                    </td>
                  </tr>
                ))}
            {!loading && paginatedRates.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No setting rates found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2 ">
        <Button
          variant="outline"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft />
        </Button>
        {[...Array(totalPages)].map((_, idx) => (
          <Button
            key={idx}
            variant={currentPage === idx + 1 ? "default" : "outline"}
            onClick={() => goToPage(idx + 1)}
            className="text-white"
          >
            {idx + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight />
        </Button>
      </div>
    </section>
  );
}
