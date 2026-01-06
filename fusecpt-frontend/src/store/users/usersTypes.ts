export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'super-admin' | 'admin' | 'user';
    status: 'Active' | 'Pending';
    createdAt: string;
    updatedAt: string;
    createdBy?: {
        _id: string;
        name: string;
        email: string;
    } | null;
    lastActive?: string;
}

export interface CreateUserRequest {
    name: string;
    email: string;
    role: 'super-admin' | 'admin' | 'user';
    password?: string;
}

export interface UpdateUserRequest {
    _id: string;
    name: string;
    email: string;
    role: 'super-admin' | 'admin' | 'user';
    password?: string;
}

export interface UsersResponse {
    success: boolean;
    data: User[];
}