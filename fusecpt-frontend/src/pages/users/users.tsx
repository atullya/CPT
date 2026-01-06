import React, { useState, useMemo } from "react";
import { Plus, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useGetUsersQuery, useDeleteUserMutation } from "@/store/users/usersApi";
import { useAppSelector } from "@/store/hooks";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import UserThreeDotMenu from "@/pages/users/UserThreeDotMenu";
import UserDialog from "@/pages/users/UserDialog";
import { ConfirmDialog } from "@/components/ui/Dialog";
import SuccessAlert from "@/components/ui/SuccessAlert";
import Pagination from "@/components/Pagination";
import type { User } from "@/store/users/usersTypes";

const Users: React.FC = () => {
    const { data: users, isLoading, isError } = useGetUsersQuery();
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

    const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const [showSuccess, setShowSuccess] = useState({ show: false, message: "" });


    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    type SortField = 'name' | 'role' | 'status' | 'createdAt' | 'lastActive';
    const [tableSort, setTableSort] = useState<{ field: SortField; direction: 'asc' | 'desc' }>({
        field: 'lastActive',
        direction: 'desc',
    });

    const handleSort = (field: SortField) => {
        setTableSort((prev) => ({
            field,
            direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const handleAddUser = () => {
        setUserToEdit(null);
        setIsUserDialogOpen(true);
    };

    const handleEditUser = (user: User) => {
        setUserToEdit(user);
        setIsUserDialogOpen(true);
    };

    const handleDeleteUser = (user: User) => {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedUser) {
            try {
                await deleteUser(selectedUser._id).unwrap();
                setDeleteDialogOpen(false);
                setSelectedUser(null);
                setShowDeleteSuccess(true);
                setTimeout(() => setShowDeleteSuccess(false), 3000);
            } catch (error) {
                console.error("Failed to delete user:", error);
            }
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setSelectedUser(null);
    };

    const getInitials = (name: string) => {
        const parts = name.split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    const formatRole = (role: string) => {
        if (role === "super-admin") return "Super Admin";
        if (role === "admin") return "Admin";
        return "User";
    };
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "just now";
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
        return formatDate(dateString);
    };



    const { user: currentUser } = useAppSelector((state) => state.auth);

    const filteredUsers = useMemo(() => {
        if (!users) return [];

        let result = users;


        if (currentUser?.role === 'user') {
            result = result.filter(u => u.role === 'user');
        } else if (currentUser?.role === 'admin') {
            result = result.filter(u => u.role === 'admin' || u.role === 'user');
        }

        const trimmedSearch = searchTerm.trim();
        if (!trimmedSearch) return result;

        return result.filter((user) =>
            user.name.toLowerCase().includes(trimmedSearch.toLowerCase())
        );
    }, [users, searchTerm, currentUser]);

    const sortedUsers = useMemo(() => {
        return [...filteredUsers].sort((a, b) => {
            const { field, direction } = tableSort;
            let aValue: any = a[field];
            let bValue: any = b[field];

            if (field === 'role') {
            } else if (field === 'lastActive') {
                aValue = a.lastActive || a.createdAt;
                bValue = b.lastActive || b.createdAt;
            }

            const stringA = String(aValue || '');
            const stringB = String(bValue || '');

            return direction === 'asc'
                ? stringA.localeCompare(stringB, undefined, { sensitivity: 'base' })
                : stringB.localeCompare(stringA, undefined, { sensitivity: 'base' });
        });
    }, [filteredUsers, tableSort]);

    // Reset pagination when search term changes
    useMemo(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedUsers.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedUsers, currentPage]);

    // Redirect to previous page if current page becomes empty after deletion
    React.useEffect(() => {
        const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
        if (currentPage > 1 && currentPage > totalPages) {
            setCurrentPage((prev) => Math.max(prev - 1, 1));
        }
    }, [filteredUsers.length, currentPage, itemsPerPage]);

    if (isLoading) {
        return (
            <div className="w-full min-h-screen bg-gray-50 p-4">
                <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <p className="text-zinc-600">Loading users...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="w-full min-h-screen bg-gray-50 p-4">
                <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <p className="text-red-600">Failed to load users. Please try again.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4">
            <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="w-full h-16 bg-white border-b border-zinc-200 px-4 md:px-6 flex items-center">
                    <div className="w-full">
                        <div className="font-plus-jakarta font-semibold text-xl leading-6 text-zinc-900">
                            Users
                        </div>
                    </div>
                </div>

                {showDeleteSuccess && (
                    <div className="px-6 pt-6">
                        <SuccessAlert
                            show={showDeleteSuccess}
                            message="User deleted successfully."
                            onDismiss={() => setShowDeleteSuccess(false)}
                            alertType="delete"
                        />
                    </div>
                )}

                {showSuccess.show && (
                    <div className="px-6 pt-6">
                        <SuccessAlert
                            show={showSuccess.show}
                            message={showSuccess.message}
                            onDismiss={() => setShowSuccess({ show: false, message: "" })}
                            alertType="create"
                        />
                    </div>
                )}


                <div className="w-full bg-white p-6 gap-6 flex flex-col">
                    <div className="flex items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search by user's name"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-10 pl-10 pr-4 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                            />
                        </div>

                        {currentUser?.role === 'super-admin' && (
                            <button
                                onClick={handleAddUser}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Add User
                            </button>
                        )}
                    </div>

                    {/* Users Table */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden min-h-[600px]">
                        <table className="w-full">
                            <thead className="border-b border-gray-200" style={{ backgroundColor: "#F5F3FF" }}>
                                <tr>
                                    <th
                                        className="px-6 py-3 text-left cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => handleSort('name')}
                                    >
                                        <div className="flex items-center gap-1">
                                            <span className="font-plus-jakarta font-medium text-sm text-[#18181B]">
                                                Users
                                            </span>
                                            {tableSort.field === 'name' ? (
                                                tableSort.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-zinc-900" /> : <ArrowDown className="w-3 h-3 text-zinc-900" />
                                            ) : (
                                                <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => handleSort('role')}
                                    >
                                        <div className="flex items-center gap-1">
                                            <span className="font-plus-jakarta font-medium text-sm text-[#18181B]">
                                                Role
                                            </span>
                                            {tableSort.field === 'role' ? (
                                                tableSort.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-zinc-900" /> : <ArrowDown className="w-3 h-3 text-zinc-900" />
                                            ) : (
                                                <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => handleSort('status')}
                                    >
                                        <div className="flex items-center gap-1">
                                            <span className="font-plus-jakarta font-medium text-sm text-[#18181B]">
                                                Status
                                            </span>
                                            {tableSort.field === 'status' ? (
                                                tableSort.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-zinc-900" /> : <ArrowDown className="w-3 h-3 text-zinc-900" />
                                            ) : (
                                                <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => handleSort('createdAt')}
                                    >
                                        <div className="flex items-center gap-1">
                                            <span className="font-plus-jakarta font-medium text-sm text-[#18181B]">
                                                Joined Date
                                            </span>
                                            {tableSort.field === 'createdAt' ? (
                                                tableSort.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-zinc-900" /> : <ArrowDown className="w-3 h-3 text-zinc-900" />
                                            ) : (
                                                <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => handleSort('lastActive')}
                                    >
                                        <div className="flex items-center gap-1">
                                            <span className="font-plus-jakarta font-medium text-sm text-[#18181B]">
                                                Last Active
                                            </span>
                                            {tableSort.field === 'lastActive' ? (
                                                tableSort.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-zinc-900" /> : <ArrowDown className="w-3 h-3 text-zinc-900" />
                                            ) : (
                                                <ArrowUpDown className="w-3 h-3 text-zinc-400" />
                                            )}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left">
                                        <span className="font-plus-jakarta font-medium text-sm text-[#18181B]">
                                            Invited By
                                        </span>
                                    </th>
                                    {currentUser?.role === 'super-admin' && (
                                        <th className="px-6 py-3 text-right">
                                            <span className="font-plus-jakarta font-medium text-xs text-zinc-600">

                                            </span>
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedUsers.map((user) => {
                                    return (
                                        <tr
                                            key={user._id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarFallback className="bg-zinc-100 text-zinc-700 font-medium text-sm">
                                                            {getInitials(user.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-plus-jakarta font-medium text-sm text-[#18181B]">
                                                            {user.name}
                                                        </span>
                                                        <span className="font-plus-jakarta text-sm text-[#18181B]">
                                                            {user.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Role */}
                                            <td className="px-6 py-4">
                                                <span className="font-plus-jakarta text-sm text-[#18181B]">
                                                    {formatRole(user.role)}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.status === "Active"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                >
                                                    {user.status}
                                                </span>
                                            </td>

                                            {/* Joined Date */}
                                            <td className="px-6 py-4">
                                                <span className="font-plus-jakarta text-sm text-[#18181B]">
                                                    {user.status === 'Pending' ? '-' : formatDate(user.createdAt)}
                                                </span>
                                            </td>

                                            {/* Last Active */}
                                            <td className="px-6 py-4">
                                                <span className="font-plus-jakarta text-sm text-[#18181B]">
                                                    {user.status === 'Pending' ? '-' : getRelativeTime(user.lastActive || user.createdAt)}
                                                </span>
                                            </td>

                                            {/* Invited By */}
                                            <td className="px-6 py-4">
                                                <span className="font-plus-jakarta text-sm text-[#18181B]">
                                                    {user.createdBy?.name || "-"}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            {currentUser?.role === 'super-admin' && (
                                                <td className="px-6 py-4 text-right">
                                                    {user._id !== currentUser?.id && (
                                                        <UserThreeDotMenu
                                                            user={user}
                                                            onEditUser={handleEditUser}
                                                            onDeleteUser={handleDeleteUser}
                                                        />
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="flex items-center justify-between pt-2">
                        <div className="w-full">
                            <Pagination
                                currentPage={currentPage}
                                totalItems={filteredUsers.length}
                                itemsPerPage={itemsPerPage}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </div>
                </div>
            </div>


            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={(open) => !open && handleCancelDelete()}
                title="Delete user?"
                description={
                    <span>
                        This will permanently delete the user. This action cannot be undone.
                    </span>
                }
                onConfirm={handleConfirmDelete}
                confirmText="Delete"
                variant="destructive"
                isLoading={isDeleting}
                contentClassName="w-[480px] h-[201px] rounded-lg border border-zinc-200 shadow-lg p-2 flex flex-col items-center justify-center"
                innerClassName="w-[416px] h-[137px] p-0 gap-6 justify-between"
            />

            <UserDialog
                open={isUserDialogOpen}
                onOpenChange={setIsUserDialogOpen}
                user={userToEdit}
                onSuccess={() => {
                    const message = userToEdit ? "User updated successfully." : "User added successfully.";
                    setShowSuccess({ show: true, message });
                    setTimeout(() => setShowSuccess({ show: false, message: "" }), 3000);
                }}
            />
        </div >
    );
};

export default Users;
