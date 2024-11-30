import {IGameData, IGameFinishResponse, IPlayerLeaderboard} from '../interfaces/responses/game.ts';
import {IGameAnalysis} from "../interfaces/requests/game.ts";
import {axiosInstance} from '../axios.ts';


export class GameService {
    public initGame = async (quantity: number) => {
        const url = '/game/init';

        return axiosInstance.get<IGameData>(url, {params: {quantity: quantity}});
    };

    public finishGame = async (gameId: number, data: IGameAnalysis) => {
        const url = `/game/${gameId}/finalize`;
        console.log('FINISH GAME:', gameId, data);

        return axiosInstance.post<IGameFinishResponse>(url, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    public getTopPlayers = async () => {
        const url = '/game/top-players';

        return axiosInstance.get<IPlayerLeaderboard>(url,);
    }
}

export const gameService = new GameService();