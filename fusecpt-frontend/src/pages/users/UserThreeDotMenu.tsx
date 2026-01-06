import React, { useState, useRef, useEffect } from "react";
import { Pencil, Trash, MoreVertical } from "lucide-react";
import type { User } from '@/store/users/usersTypes';

interface UserThreeDotMenuProps {
    user: User;
    onEditUser?: (user: User) => void;
    onDeleteUser?: (user: User) => void;
}

const UserThreeDotMenu: React.FC<UserThreeDotMenuProps> = ({
    user,
    onEditUser,
    onDeleteUser,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleScroll = () => {
            setIsOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", handleScroll, true);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScroll, true);
        };
    }, []);

    const handleEdit = () => {
        onEditUser?.(user);
        setIsOpen(false);
    };

    const handleDelete = () => {
        onDeleteUser?.(user);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-9 h-9 min-w-9 min-h-9 rounded-md p-0.5 flex items-center justify-center transition cursor-pointer
 ${isOpen ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
            >
                <MoreVertical className="w-4 h-4 text-gray-700" />
            </button>

            {isOpen && (
                <div
                    className="
            fixed mt-2
            w-32 h-[84px]
            bg-white border border-gray-200 shadow-lg
            rounded-lg p-0.5 flex flex-col gap-2
            z-9999
          "
                    style={{
                        top: menuRef.current ? menuRef.current.getBoundingClientRect().bottom + window.scrollY : 0,
                        left: menuRef.current ? menuRef.current.getBoundingClientRect().left + window.scrollX - 140 : 0,
                    }}
                >
                    <div className="w-[124px] h-[68px] flex flex-col justify-between rounded-md p-0.5 gap-1">
                        <button
                            onClick={handleEdit}
                            className="
                w-[120px] h-[33px] flex items-center justify-center
                bg-gray-50 hover:bg-gray-100 cursor-pointer
                rounded-md px-0.5 py-[5.5px] transition
              "
                        >
                            <div
                                className="
                  w-[104px] h-[22px] flex items-center justify-between
                  bg-white rounded-md
                "
                            >
                                <div className="w-[15px] h-[13px] flex items-center justify-center ml-0.5">
                                    <Pencil className="w-[15px] h-[13px] text-gray-700" />
                                </div>
                                <div className="font-plus-jakarta w-[76px] flex items-center text-[14px] font-normal leading-[22px] text-gray-800">
                                    Edit
                                </div>
                            </div>
                        </button>

                        <div className="w-[124px] h-[9px] flex flex-col items-center justify-center gap-2 opacity-100">
                            <div className="w-[124px] h-px bg-[#E5E5E5] rounded-sm" />
                        </div>

                        <button
                            onClick={handleDelete}
                            className="
                w-[120px] h-[33px] flex items-center justify-center
                bg-gray-50 hover:bg-gray-100 cursor-pointer
                rounded-md px-0.5 py-[5.5px] transition
              "
                        >
                            <div
                                className="
                  w-[104px] h-[22px] flex items-center justify-between
                  bg-white rounded-md
                "
                            >
                                <div className="w-[15px] h-[13px] flex items-center justify-center ml-0.5">
                                    <Trash className="w-[15px] h-[13px] text-red-600" />
                                </div>
                                <div className="font-plus-jakarta w-[76px] flex items-center text-[14px] font-normal leading-[22px] text-red-600">
                                    Delete
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserThreeDotMenu;
