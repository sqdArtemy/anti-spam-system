interface CheckRequest {
    id: number;
    input: string;
    aiSus: boolean;
    actualSus: boolean;
}

export interface IGameData {
    gameId: number;
    checkRequests: CheckRequest[];
}

export interface ITopPlayer {
    userName: string;
    userScore: number;
    scorePercentage: number;
}

export interface IPlayerLeaderboard {
    topPlayers: ITopPlayer[];
}

export interface IGameFinishResponse {
    message: string;
    user_rating: number;
}

