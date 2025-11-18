"use client";
import { useEffect, useState } from "react";
import { Pencil, Trash, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; // ✅ shadcn skeleton

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(true); // ✅ page loading state
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [open, setisopen] = useState(false);

  // Fetch all categories
  const fetchCategories = async () => {
    setLoading(true);
    const res = await fetch("/api/form/category");
    const data = await res.json();
    if (data.success) {
      setCategories(data.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Create
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategory) return;
    setCreating(true);

    const res = await fetch("/api/form/category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: newCategory }),
    });
    const data = await res.json();

    if (data.success) {
      toast.success("Category added successfully!");
      setNewCategory("");
      fetchCategories();
      setisopen(false);
    } else {
      toast.error(data.error || "Failed to add category");
    }
    setCreating(false);
  };

  // Update
  const handleUpdate = async (id) => {
    if (!editValue) return;
    setUpdating(true);

    const res = await fetch(`/api/form/category/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: editValue }),
    });
    const data = await res.json();

    if (data.success) {
      toast.success("Category updated successfully!");
      setEditId(null);
      setEditValue("");
      fetchCategories();
    } else {
      toast.error(data.error || "Failed to update category");
    }
    setUpdating(false);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    setDeletingId(id);
    console.log("id>>>",id);
    

    const res = await fetch(`/api/form/category/${id}`, { method: "DELETE" });
    const data = await res.json();
    console.log("daia>>>>>",data)

    if (data.sucess) {
      toast.success("Category deleted successfully!");
      fetchCategories();
    } else {
      toast.error(data.error || "Failed to delete category");
    }
    setDeletingId(null);
  };

  return (
    <section className="p-6 ">
      <Toaster position="top-right" reverseOrder={false} />

      <h1 className="mb-4 text-2xl font-bold">Category Management</h1>

      {/* Add Category */}
      <Dialog open={open} onOpenChange={setisopen}>
        <DialogTrigger asChild>
          <div className="flex justify-end">
            <Button className="text-white">Add New Category</Button>
          </div>
        </DialogTrigger>
        <DialogOverlay className="fixed inset-0 bg-black/60" />
        <DialogContent className="w-full md:w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-center">
              Create New Category
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleCreate}
            className="mb-6 flex flex-col gap-4 items-center"
          >
            <input
              type="text"
              placeholder="Enter category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-64 rounded border border-black-1/40 p-2"
            />
            <Button
              type="submit"
              disabled={creating}
              className="rounded bg-primary text-white px-4 py-1 disabled:opacity-50"
            >
              {creating && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
              )}
              {creating ? "Adding..." : "Add"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Category Table */}
      <table className="w-[90%] mx-auto border-collapse border mt-4">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="w-[10%] p-2 border">#</th>
            <th className="w-[70%] p-2 border">Category</th>
            <th className="text-center p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? [...Array(5)].map((_, idx) => (
                <tr key={idx}>
                  <td className="p-2 border">
                    <Skeleton className="h-4 w-6" />
                  </td>
                  <td className="p-2 border">
                    <Skeleton className="h-4 w-32" />
                  </td>
                  <td className="p-2 border flex justify-center gap-2">
                    <Skeleton className="h-6 w-6 rounded" />
                    <Skeleton className="h-6 w-6 rounded" />
                  </td>
                </tr>
              ))
            : categories.map((cat, idx) => (
                <tr key={cat._id}>
                  <td className="p-2 border">{idx + 1}</td>
                  <td className="p-2 border">
                    {editId === cat._id ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="rounded border p-1 w-full"
                      />
                    ) : (
                      cat.category
                    )}
                  </td>
                  <td className="flex justify-center gap-2 p-2 border">
                    {editId === cat._id ? (
                      <>
                        <Button
                          onClick={() => handleUpdate(cat._id)}
                          disabled={updating}
                          className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
                        >
                          {updating && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
                          )}
                          {updating ? "Saving..." : "Save"}
                        </Button>
                        <Button
                          onClick={() => {
                            setEditId(null);
                            setEditValue("");
                          }}
                          className="bg-gray-400 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditId(cat._id);
                            setEditValue(cat.category);
                          }}
                          className="text-blue-500 hover:text-blue-400 px-2 py-1"
                        >
                          <Pencil size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          // className="text-red-600 px-2 py-1"
                          disabled={deletingId === cat._id}
                        >
                          {deletingId === cat._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash size={20} />
                          )}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}

          {!loading && categories.length === 0 && (
            <tr>
              <td colSpan="3" className="p-4 text-center text-gray-500">
                No categories found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
