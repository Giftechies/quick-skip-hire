"use client";
import { useEffect, useState } from "react";
import { Pencil, Trash, ChevronLeft, ChevronRight, SearchIcon, Loader2 } from "lucide-react";
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

export default function PostcodePage() {
  const [postcodes, setPostcodes] = useState([]);
  const [newPostcode, setNewPostcode] = useState("");
  const [editId, setEditId] = useState(null);
  const [editCode, setEditCode] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setisopen] = useState(false);
  const [totalpostcode,setTotalPostCode] = useState(null);

  // Bulk upload popup message
  const [bulkMessage, setBulkMessage] = useState(null);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Fetch all postcodes
  const fetchPostcodes = async () => {
    setLoading(true);
    const res = await fetch("/api/form/postcode");
    const data = await res.json();
    console.log(data,"fetchPost>>>");
    

    if(data)setTotalPostCode(data.length)
    
    setPostcodes(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPostcodes();
  }, []);

  // Create
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newPostcode) return;
    setCreating(true);

    const res = await fetch("/api/form/postcode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postcode: newPostcode }),
    });

    if (res.ok) {
      setisopen(false);
      setNewPostcode("");
      fetchPostcodes();
    }
    setCreating(false);
  };

  // Update
  const handleUpdate = async (id) => {
    setUpdating(true);
    await fetch(`/api/form/postcode/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postcode: editCode }),
    });

    setEditId(null);
    setEditCode("");
    fetchPostcodes();
    setUpdating(false);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!confirm("Delete this postcode?")) return;
    console.log(id,'haandledeltee');
    
    setDeletingId(id);

    await fetch(`/api/form/postcode/${id}`, { method: "DELETE" });
    fetchPostcodes();
    setDeletingId(null);
  };

  // Bulk upload
  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const data = await fetch("/api/form/postcode/bulk", {
        method: "POST",
        body: formData,
      });
      const res = await data.json();

      if (res.success) {
        setBulkMessage({
          type: "success",
          text: `✅ Uploaded ${res.inserted} new, skipped ${res.skipped.length}`,
        });
      } else {
        setBulkMessage({
          type: "error",
          text: `❌ ${res.error || "Bulk upload failed"}`,
        });
      }
      setisopen(false);
      fetchPostcodes();
    } catch (err) {
      setBulkMessage({
        type: "error",
        text: "❌ Something went wrong while uploading.",
      });
    }

    // Auto hide after 4 sec
    setTimeout(() => setBulkMessage(null), 6000);
  };

  // Filter postcodes
  const filteredPostcodes =
   postcodes?.filter((pc) =>
    pc.postcode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredPostcodes.length / itemsPerPage);
  const paginatedPostcodes = filteredPostcodes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <section className="p-6 border border-red-200 relative">
      <h1 className="mb-4 text-2xl font-bold">Postcode Management</h1>

      {/* ✅ Bulk Upload Popup */}
      {bulkMessage && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg text-white z-50 transition-opacity duration-300
          ${bulkMessage.type === "success" ? "bg-green-600" : "bg-red-600"}`}
        >
          {bulkMessage.text}
        </div>
      )}

      {/* Search + Add + Bulk Import */}
      <div className="mb-6 flex flex-wrap justify-between gap-2 items-center">
        {/* Search */}
      
        <span className="rounded border p-2 w-96 flex items-center">
          <input
            type="text"
            placeholder="Search postcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full outline-none"
          />
          <SearchIcon />
        </span>

        {/* Add + Bulk */}
    <div className=" flex  gap-4 items-center " >
        <span>Total PostCode: {loading? "loading...":`${totalpostcode}`}</span>
        <Dialog open={open} onOpenChange={setisopen}>
          <DialogTrigger asChild>
            <Button className="text-white">Add New Postcode</Button>
          </DialogTrigger>
          <DialogOverlay className="fixed inset-0 bg-black/50" />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Postcode</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleCreate}
              className="flex flex-col p-4 gap-2 items-center"
            >
              <input
                type="text"
                placeholder="Enter postcode"
                value={newPostcode}
                onChange={(e) => setNewPostcode(e.target.value)}
                className="w-full rounded border border-black-1/40 p-2"
              />
              <div className="flex gap-3 mt-4">
                <Button
                  type="submit"
                  className="rounded bg-primary text-white"
                  disabled={creating}
                >
                  {creating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {creating ? "Adding..." : "Add"}
                </Button>

                {/* Bulk Import */}
                <input
                  id="bulkFile"
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleBulkUpload}
                  className="hidden"
                />
                <label
                  htmlFor="bulkFile"
                  className="cursor-pointer rounded bg-black shrink-0 text-white px-4 py-2 hover:bg-black"
                >
                  Import Bulk
                </label>
              </div>
            </form>
          </DialogContent>
        </Dialog>
    </div>
      </div>

      {/* Postcode Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="w-[20%] p-2">Sr.No</th>
            <th className="w-[60%] p-2">Postcode</th>
            <th className="text-center p-2 w-[25%]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            [...Array(itemsPerPage)].map((_, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2">
                  <Skeleton className="h-4 w-10" />
                </td>
                <td className="p-2">
                  <Skeleton className="h-4 w-40" />
                </td>
                <td className="p-2 flex justify-center space-x-2">
                  <Skeleton className="h-6 w-6 rounded" />
                  <Skeleton className="h-6 w-6 rounded" />
                </td>
              </tr>
            ))
          ) : paginatedPostcodes.length > 0 ? (
            paginatedPostcodes.map((pc, idx) => (
              <tr key={pc._id} className="border-t">
                <td className="p-2">
                  {(currentPage - 1) * itemsPerPage + idx + 1}
                </td>
                <td className="p-2">
                  {editId === pc._id ? (
                    <input
                      type="text"
                      value={editCode}
                      onChange={(e) => setEditCode(e.target.value)}
                      className="rounded p-1 border-2 w-full border-black-1"
                    />
                  ) : (
                    pc.postcode
                  )}
                </td>
                <td className="space-x-2 flex justify-center p-2">
                  {editId === pc._id ? (
                    <>
                      <Button
                        onClick={() => handleUpdate(pc._id)}
                        className=" bg-black text-white"
                        disabled={updating}
                      >
                        {updating ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        {updating ? "Updating..." : "Update"}
                      </Button>
                      <Button
                        onClick={() => {
                          setEditId(null);
                          setEditCode("");
                        }}
                        className=" bg-black text-white"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditId(pc._id);
                          setEditCode(pc.postcode);
                        }}
                        className="text-blue-500 hover:text-blue-400 px-2 py-1"
                      >
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(pc._id)}
                        className="text-red-600 px-2 py-1"
                        disabled={deletingId === pc._id}
                      >
                        {deletingId === pc._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash size={20} />
                        )}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="p-4 text-center text-gray-500">
                No postcodes found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            <ChevronLeft />
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToPage(idx + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === idx + 1
                  ? "bg-primary text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {idx + 1}
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
