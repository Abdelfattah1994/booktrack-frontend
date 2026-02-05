export interface AuthResponse {
    token: string;
    username: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    email: string;
}

export interface Book {
    id: number;
    title: string;
    author: string;
    description: string;
    popularity: number;
}