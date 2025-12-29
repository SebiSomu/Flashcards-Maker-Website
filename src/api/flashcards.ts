import axios from "axios";

const API_URL = "http://localhost:8080/api/flashcards";
const FOLDER_API_URL = "http://localhost:8080/api/folders";

export interface Folder {
    ID: number;
    name: string;
    userId: number;
    parentId?: number | null;
}

export interface Flashcard {
    ID: number;
    front: string;
    back: string;
    folderId?: number | null;
    userId: number;
    nextReviewAt?: string;
    interval?: number;
    easeFactor?: number;
    repetitions?: number;
}

export interface CreateFlashcardDTO {
    front: string;
    back: string;
    folderId?: number | null;
    nextReviewAt?: string;
    interval?: number;
    easeFactor?: number;
    repetitions?: number;
}

export interface CreateFolderDTO {
    name: string;
    parentId?: number | null;
}

export const fetchFlashcards = async (token: string): Promise<Flashcard[]> => {
    const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const createFlashcard = async (token: string, card: CreateFlashcardDTO): Promise<Flashcard> => {
    const response = await axios.post(API_URL, card, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updateFlashcard = async (token: string, id: number, card: CreateFlashcardDTO): Promise<Flashcard> => {
    const response = await axios.put(`${API_URL}/${id}`, card, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const deleteFlashcard = async (token: string, id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// --- Folder API ---

export const fetchFolders = async (token: string): Promise<Folder[]> => {
    const response = await axios.get(FOLDER_API_URL, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const createFolder = async (token: string, folder: CreateFolderDTO): Promise<Folder> => {
    const response = await axios.post(FOLDER_API_URL, folder, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const deleteFolder = async (token: string, id: number): Promise<void> => {
    await axios.delete(`${FOLDER_API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const fetchCurrentUser = async (token: string): Promise<any> => {
    const response = await axios.get("http://localhost:8080/api/me", {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const dismissSmartReview = async (token: string, hours: number = 24): Promise<void> => {
    await axios.post("http://localhost:8080/api/user/dismiss-smart-review", { hours }, {
        headers: { Authorization: `Bearer ${token}` }
    });
};
