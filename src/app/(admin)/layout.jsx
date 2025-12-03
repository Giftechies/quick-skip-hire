"use client";
import Sidebar from "@/components/sharedUi/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,

  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {  ChartLine, MenuIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MenuItem } from "@/components/ui/Menuitem";
import { useRouter } from "next/navigation";

export default function RootLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useRouter();
  const Openhandling = () => {
    setIsMenuOpen(!isMenuOpen)
  }
  return (
    <div className="flex min-h-screen">
      {/* Sidebar (fixed/sticky) */}
      <Sidebar className="fixed left-0 top-0 z-50  hidden  overflow-y-auto  w-80 shadow-lg lg:block " />

      {/* Main Content Area */}
      <div className=" flex flex-1 flex-col lg:ml-80  ">
        {/* Header */}
        <header className=" sticky right-0 top-0 z-50 flex  h-16 w-full items-center justify-between bg-white  px-8 shadow-md lg:justify-end ">

          <Button variant="outline" onClick={Openhandling} className="lg:hidden">
            <MenuIcon />
          </Button>
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}  >
            <SheetTrigger>

            </SheetTrigger>
            <SheetContent side="left" className=" bg-black text-white overflow-y-auto ">
              <SheetHeader>
                <SheetTitle>
                  {" "}
                  <h3
                    onClick={() => navigate.push("/admin")}
                    className="h4 flex items-center justify-center cursor-pointer gap-2 font-semibold text-white"
                  >
                    <ChartLine  className="" /> Admin Panel
                  </h3>
                </SheetTitle>
              </SheetHeader>

              <div>
                <MenuItem />
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center justify-between space-x-6">
            <Link
              href="https://www.quickskiphire.com/"
              target="_blank"
              className="rounded bg-black px-3 py-2 text-[13px] text-white"
            >
              Go To Frontend
            </Link>

            <button className="relative text-gray-600 hover:text-[#154583]">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                <span className="font-medium text-gray-600">MS</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Mandeep Singh
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="w-full flex-1 overflow-y-auto  ">{children}</main>
      </div>
    </div>
  );
}
