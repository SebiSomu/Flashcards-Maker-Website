import axios from "axios";

const API_URL = "http://localhost:8080/api/flashcards";

export interface Flashcard {
    ID: number;
    front: string;
    back: string;
    userId: number;
}

export interface CreateFlashcardDTO {
    front: string;
    back: string;
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
