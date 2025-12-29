export interface User {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    email: string;
    smartReviewDismissedUntil?: string;
    // Password is usually not sent back to frontend for security, but preserving structure if needed
}

export interface LoginResponse {
    user: User;
    token: string;
}
