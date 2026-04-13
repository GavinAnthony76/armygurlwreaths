export type UserRole = 'customer' | 'admin';
export interface User {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: UserRole;
    phone: string | null;
    createdAt: string;
    updatedAt: string;
}
export interface AuthTokenPayload {
    sub: string;
    email: string;
    role: UserRole;
    iat: number;
    exp: number;
}
export interface LoginResponse {
    user: User;
    accessToken: string;
}
