import React, { useState, useRef, useEffect } from "react";
import { LogOut, ChevronsUpDown } from "lucide-react";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/store/store";
import { useLogoutMutation } from "@/store/auth/authApi";
import { logout } from "@/store/auth/authSlice";

interface UserSectionProps {
  collapsed: boolean;
}

export const UserSection: React.FC<UserSectionProps> = ({ collapsed }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [logoutApi] = useLogoutMutation();

  const userName = user?.name || "User";
  const userRole = user?.role || "Role";
  const userEmail = user?.email || "email@example.com";

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      dispatch(logout());
      navigate("/login");
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const initials = getInitials(userName);

  return (
    <div ref={wrapperRef} className="relative w-full">
      {collapsed ? (
        <div
          onClick={() => setOpen(!open)}
          className="
            w-9 h-9 rounded-lg bg-zinc-200 
            flex items-center justify-center 
            text-[14px] font-medium text-zinc-700 
            cursor-pointer select-none mx-auto
          "
        >
          {initials}
        </div>
      ) : (
        <button
          onClick={() => setOpen(!open)}
          className="
            flex items-center justify-between
            w-full px-2 py-[6px]
            rounded-md cursor-pointer
            hover:bg-zinc-100 transition
          "
        >
          <div className="flex items-center gap-2">
            <div
              className="
                w-9 h-9 min-w-9 min-h-9 rounded-lg
                bg-zinc-200 text-zinc-700
                flex items-center justify-center
                text-[14px] font-medium
              "
            >
              {initials}
            </div>

            <div className="flex flex-col leading-tight items-start">
              <span className="text-[14px] font-medium text-zinc-900 truncate max-w-[120px]">
                {userName}
              </span>
              <span className="text-[12px] text-zinc-500 truncate max-w-[120px]">
                {userRole}
              </span>
            </div>
          </div>

          <ChevronsUpDown className="w-4 h-4 text-zinc-500" />
        </button>
      )}

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute left-full bottom-0 ml-2
            w-[238px] h-[107px]
            bg-white border border-zinc-200 rounded-lg
            shadow-md p-1 z-50
          "
        >
          <div className="flex items-center gap-2 p-2">
            <div className="w-8 h-8 bg-zinc-200 rounded-lg flex items-center justify-center text-sm font-medium text-zinc-700">
              {initials}
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-medium text-zinc-900">
                {userName}
              </span>
              <span className="text-[13px] text-zinc-500">{userEmail}</span>
            </div>
          </div>
          <div className="border-t border-zinc-200 my-1"></div>
          <button
            onClick={handleLogout}
            className="
              flex items-center gap-2 w-full 
              p-2 rounded-md hover:bg-zinc-100
              text-[14px] text-zinc-900 transition
            "
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
};
