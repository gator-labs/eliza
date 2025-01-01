export interface ChompQuestion {
    id: string;
    question: string;
    answer: string;
    category?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    created_at: Date;
    updated_at: Date;
}

export interface CreateQuestionParams {
    question: string;
    answer: string;
    category?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
}

export interface FindQuestionParams {
    category?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    searchTerm?: string;
}