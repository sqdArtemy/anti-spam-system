interface SusData {
    checkRequestId: number;
    actualSus: boolean;
    userSus: boolean;
}

export interface IGameAnalysis {
    maxTime: string;
    data: SusData[];
}