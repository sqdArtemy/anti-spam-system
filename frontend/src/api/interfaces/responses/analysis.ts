import {IUserResponse} from '../responses/user';

export interface SentimentAnalysis {
    label: string;
    score: number;
}

interface ImportantWords {
    [key: string]: number;
}

export interface IAnalysisResponse {
    id: number;
    input: string;
    output: {
        isSuspicious: number;
        confidence: number;
        importantWords: ImportantWords;
        timeTaken: number;
        sentiment: SentimentAnalysis | string;
        text?: string;
    };
    isSus: boolean;
    confidence: number;
    user: IUserResponse;
    checkTime: number;
    wordsCount: number;
    imagePath: string | null;
    createdAt: string;
    updatedAt: string;
}

