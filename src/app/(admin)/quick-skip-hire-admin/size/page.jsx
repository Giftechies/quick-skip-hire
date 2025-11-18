"use client";

import { useEffect, useState } from "react";
import {
  Pencil,
  Trash,
  SearchIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button"; // Shadcn Button
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
} from "@/components/ui/dialog";

export default function SizePage() {
  const [sizes, setSizes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newSize, setNewSize] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editId, setEditId] = useState(null);
  const [editSize, setEditSize] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchSize, setSearchSize] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [isopen, setIsopen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Fetch all sizes
  const fetchSizes = async () => {
    const res = await fetch("/api/form/size");
    const data = await res.json();
    if (data.success) setSizes(data.data);
  };

  // Fetch all categories
  const fetchCategories = async () => {
    const res = await fetch("/api/form/category");
    const data = await res.json();
    if (data.success) setCategories(data.data);
  };

  useEffect(() => {
    fetchSizes();
    fetchCategories();
  }, []);

  // Filter sizes by size name and category
  const filteredSizes = sizes.filter((size) => {
    const matchesSize = size.size
      .toLowerCase()
      .includes(searchSize.toLowerCase());
    const matchesCategory =
      !searchCategory || size.category?._id === searchCategory;
    return matchesSize && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredSizes.length / itemsPerPage);
  const paginatedSizes = filteredSizes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Create size
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newSize || !selectedCategory) return toast.error("Fill all fields");
    setLoading(true);

    try {
      const res = await fetch("/api/form/size", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ size: newSize, categoryId: selectedCategory }),
      });
      const data = await res.json();
      console.log("data size>>>>",data)

      if (data.success) {
        toast.success("Size added successfully");
        setNewSize("");
        setSelectedCategory("");
        fetchSizes();
        setIsopen(false);
      } else {
        toast.error(data.message || "Failed to add size");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Update size
  const handleUpdate = async (id) => {
    if (!editSize || !editCategory) return toast.error("Fill all fields");
    setLoading(true);

    try {
      const res = await fetch("/api/form/size", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, size: editSize, categoryId: editCategory }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Size updated successfully");
        setEditId(null);
        setEditSize("");
        setEditCategory("");
        fetchSizes();
      } else {
        toast.error(data.message || "Failed to update size");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Delete size
  const handleDelete = async (id) => {
    if (!confirm("Delete this size?")) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/form/size?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Size deleted successfully");
        fetchSizes();
      } else {
        toast.error(data.message || "Failed to delete size");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="border border-gray-200 p-6">
      <Toaster position="top-right" reverseOrder={false} />
      <h1 className="mb-4 text-2xl font-bold">Size Management</h1>

      <div className="flex flex-col max-md:items-end md:flex-row justify-between gap-2 lg:gap-6">
        {/* Search Filters */}
        <div className="mb-4 flex gap-6">
          <span className="flex items-center gap-1 rounded-md border max-md:justify-between border-black-1/40 p-2 w-full lg:w-64">
            <input
              type="text"
              placeholder="Search by size..."
              value={searchSize}
              onChange={(e) => setSearchSize(e.target.value)}
              className="w-full"
            />
            <SearchIcon />
          </span>
          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="w-full lg:w-64 rounded-md border border-black-1/40 p-2"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.category}
              </option>
            ))}
          </select>
        </div>

        {/* Add New Size Dialog */}
        <Dialog open={isopen} onOpenChange={setIsopen}>
          <DialogTrigger asChild>
            <Button className="text-white w-fit">Add New Size</Button>
          </DialogTrigger>
          <DialogOverlay className="fixed inset-0 bg-black/50" />
          <DialogContent className="w-[90%] md:h-[250px] md:w-[650px] rounded-lg">
            <DialogHeader className="text-center">
              <DialogTitle>Create New Size</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreate} className="flex flex-col gap-4 p-2">
              <input
                type="text"
                placeholder="Enter size"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                className="rounded border border-black-1/40 p-2"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded border border-black-1/40 p-2"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.category}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={loading}
                className="rounded bg-primary px-4 py-2 text-white disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Size"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sizes Table */}
      <table className="w-full border-collapse border mt-4">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="w-[5%] border p-2">#</th>
            <th className="w-[35%] border p-2">Size</th>
            <th className="w-[35%] border p-2">Category</th>
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedSizes.map((size, idx) => (
            <tr key={size._id}>
              <td className="border p-2">
                {(currentPage - 1) * itemsPerPage + idx + 1}
              </td>
              <td className="border p-2">
                {editId === size._id ? (
                  <input
                    type="text"
                    value={editSize}
                    onChange={(e) => setEditSize(e.target.value)}
                    className="w-full rounded border p-1"
                  />
                ) : (
                  size.size
                )}
              </td>
              <td className="border p-2">
                {editId === size._id ? (
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full rounded border p-1"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.category}
                      </option>
                    ))}
                  </select>
                ) : (
                  size.category?.category || "N/A"
                )}
              </td>
              <td className="flex justify-center gap-2 border p-2">
                {editId === size._id ? (
                  <>
                    <button
                      onClick={() => handleUpdate(size._id)}
                      disabled={loading}
                      className="text-white rounded bg-primary px-3 py-1 disabled:opacity-50"
                    >
                      {loading ? "Updating..." : "Udpate"}
                    </button>
                    <button
                      onClick={() => {
                        setEditId(null);
                        setEditSize("");
                        setEditCategory("");
                      }}
                      className="text-white rounded bg-primary px-3 py-1"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <div className="flex gap-6" >
                    <button
                      onClick={() => {
                        setEditId(size._id);
                        setEditSize(size.size);
                        setEditCategory(size.category?._id || "");
                      }}
                     
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(size._id)}
                      disabled={loading}
                      
                    >
                      {loading ? "..." : <Trash size={20} />}
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
          {paginatedSizes.length === 0 && (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500">
                No sizes found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center gap-2">
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
