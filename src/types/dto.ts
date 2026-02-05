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
    email: string;
    password: string;
}

export interface BookResponse {
    id: number;
    title: string;
    author: string;
    summary: string;
    rating: number;
    isbn: string;
}

export interface PageBookResponse {
    content: BookResponse[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    last: boolean;
    first: boolean;
}