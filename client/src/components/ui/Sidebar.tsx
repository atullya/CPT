// import React, { useState } from "react";
// import {
//   PanelRight,
//   LayoutDashboard,
//   BriefcaseBusiness,
//   Settings,
// } from "lucide-react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
// import { useSelector } from "react-redux";
// const Sidebar: React.FC = () => {
//   const user = useSelector((state: any) => state.auth.user);
//   const [darkMode, setDarkMode] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();

//   const isActive = (path: string) => location.pathname === path;

//   return (
//     <div className="flex flex-col h-screen w-64 lg:w-64 md:w-16 sm:w-12 bg-[#FAFAFA] gap-2.5">
//       <div className="flex flex-col grow">
//         <div className="w-full h-16 flex items-center justify-between px-2 py-2">
//           <div className="flex items-center gap-2 min-w-0 flex-1">
//             <div className="w-[27px] h-[24px] relative flex">
//               <div className="absolute top-0 left-0 w-[12.1659px] h-[16.3524px]">
//                 <img
//                   src="/src/assets/logo1.svg"
//                   alt="logo-left"
//                   className="w-full h-full"
//                 />
//               </div>

//               <div className="absolute top-[0.02px] left-[10.67px] w-[16.3316px] h-[24.0334px]">
//                 <img
//                   src="/src/assets/logo2.svg"
//                   alt="logo-right"
//                   className="w-full h-full"
//                 />
//               </div>
//             </div>

//             <div className="flex items-center md:block hidden">
//               <span className="font-[Ubuntu] font-medium text-[20px] leading-[22px] text-[#18181B] whitespace-nowrap">
//                 Fuse CPT
//               </span>
//             </div>
//           </div>

//           <button className="w-9 h-9 min-w-[36px] min-h-[36px] p-0.5 rounded-[8px] bg-transparent hover:bg-gray-200 flex items-center justify-center">
//             <PanelRight className="w-4 h-4 text-gray-700" />
//           </button>
//         </div>

//         <div className="flex flex-col p-2 gap-2 flex-1">
//           <div className="w-full flex flex-col gap-2">
//             <div
//               onClick={() => navigate("/dashboard")}
//               className={`
//     flex items-center gap-2 rounded-md
//     px-3 py-1 h-8 cursor-pointer transition-colors
//     ${
//       isActive("/dashboard")
//         ? "bg-violet-50 text-violet-700"
//         : "text-zinc-700 hover:bg-zinc-100"
//     }
//   `}
//             >
//               <LayoutDashboard
//                 className={`
//       w-4 h-4
//       ${isActive("/dashboard") ? "text-violet-700" : "text-zinc-700"}
//     `}
//               />

//               <span
//                 className={`
//       font-semibold
//       text-[14px] leading-[22px] md:block hidden
//       ${isActive("/dashboard") ? "text-violet-700" : "text-zinc-700"}
//     `}
//               >
//                 Dashboard
//               </span>
//             </div>

//             <div
//               onClick={() => navigate("/jobs")}
//               className={`
//     flex items-center gap-2 rounded-md
//     px-3 py-1 h-8 cursor-pointer transition-colors
//     ${
//       isActive("/jobs")
//         ? "bg-violet-50 text-violet-700"
//         : "text-zinc-700 hover:bg-zinc-100"
//     }
//   `}
//             >
//               <BriefcaseBusiness className="w-4 h-4" />

//               <span className="font-semibold text-[14px] leading-[22px] md:block hidden">
//                 Job Listing
//               </span>
//             </div>

//             <div
//               onClick={() => navigate("/settings")}
//               className={`
//     flex items-center gap-2 rounded-md
//     px-3 py-1 h-8 cursor-pointer transition-colors
//     ${
//       isActive("/settings")
//         ? "bg-violet-50 text-violet-700"
//         : "text-zinc-700 hover:bg-zinc-100"
//     }
//   `}
//             >
//               <Settings className="w-4 h-4" />

//               <span className="font-semibold text-[14px] leading-[22px] md:block hidden">
//                 Settings
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="mt-auto ">
//         <div className="p-3 flex flex-col gap-3">
//           <div className="flex items-center justify-between border border-[#E4E4E7] bg-white rounded-lg px-3 py-2">
//             <span className="text-sm text-gray-800">Dark Mode</span>
//             <button
//               onClick={() => setDarkMode(!darkMode)}
//               className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${
//                 darkMode ? "bg-gray-800" : "bg-gray-300"
//               }`}
//             >
//               <div
//                 className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-300 ${
//                   darkMode ? "translate-x-5" : "translate-x-0"
//                 }`}
//               />
//             </button>
//           </div>

//           <div className="w-full h-[46px] flex items-center gap-2 px-2 py-0.5 rounded-md hover:bg-gray-100 cursor-pointer">
//             <Avatar className="w-8 h-8 rounded-md">
//               <AvatarFallback className="bg-violet-600 text-white font-semibold">
//                 {(user?.name || "U")
//                   .split(" ")
//                   .map((word: any) => word[0])
//                   .join("")
//                   .toUpperCase()}
//               </AvatarFallback>
//             </Avatar>

//             <div className="flex flex-col justify-center gap-[2px] overflow-hidden md:block hidden min-w-0 h-[42px] w-[113px]">
//               <div className="truncate h-[22px] flex items-center">
//                 <span className="text-[14px] font-medium leading-[150%] tracking-[0.005em] text-[#09090B] font-['Geist']">
//                   {user?.name ??
//                     (JSON.parse(localStorage.getItem("auth_user") || "{}")
//                       ?.name ||
//                       "User")}
//                 </span>
//               </div>

//               <div className="h-[18px] flex items-center">
//                 <span className="text-[12px] font-normal leading-[18px] text-[#09090B] font-['Plus Jakarta Sans']">
//                   {user?.role || "Role"}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
