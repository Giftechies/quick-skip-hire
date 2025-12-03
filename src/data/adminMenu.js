import { ChartArea, ChevronDown, ChevronRight,MapPin,ClipboardList,Ruler,Clock3,Settings,Truck,CirclePlus,CirclePoundSterling, ShoppingBasket, } from "lucide-react"
 export const menu = [
      { label: "Orders", path: "/quick-skip/admin/orders",icon:ShoppingBasket },
      { label: "Postcode", path: "/quick-skip/admin/postcode",icon:MapPin },
        { label: "Category", path: "/quick-skip/admin/category",icon:ClipboardList  },
        { label: "Size", path: "/quick-skip/admin/size",icon:Ruler  },
        { label: "Rates", path: "/quick-skip/admin/rates" ,icon:CirclePoundSterling },
        { label: "Extra", path: "/quick-skip/admin/extra" ,icon:CirclePlus },
        { label: "Roll om Roll Off", path: "/quick-skip/admin/roll-&-roll",icon:Truck  },
        { label: "Default Rates", path: "/quick-skip/admin/setting-rate",icon:Settings  },
        { label: "Default Roll on Roll Off", path: "/quick-skip/admin/setting-roll",icon:Settings  },
        { label: "Time Slot", path: "/quick-skip/admin/timeslot",icon:Clock3  },
 ]

 