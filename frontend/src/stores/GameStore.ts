import {makeAutoObservable} from 'mobx';
import {gameService} from '../api/services/gameService';
import {AxiosError, AxiosResponse} from 'axios';
import {IGameData, IGameFinishResponse, IPlayerLeaderboard, ITopPlayer} from '../api/interfaces/responses/game';
import {IGameAnalysis} from '../api/interfaces/requests/game';

type GameState = 'pending' | 'loading' | 'success' | 'error';

class GameStore {
    gameData: IGameData = {gameId: -1, checkRequests: []};
    state: GameState = 'pending';

    finishState: GameState = 'pending';
    finalData: IGameAnalysis & { score: number } | null = null;

    errorMessage: string = '';
    leaderboard: IPlayerLeaderboard | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    set currentState(state: GameState) {
        this.state = state;
    }

    get data(): IGameData {
        return this.gameData;
    }

    set data(gameData: IGameData) {
        this.gameData = gameData;
    }

    set finishData(data: IGameAnalysis & { score: number } | null) {
        this.finalData = data;
    }

    get finishData(): IGameAnalysis & { score: number } | null {
        return this.finalData;
    }

    set errorMsg(error: string) {
        if (error[0] === '{') {
            error = 'Something went wrong.';
        }
        this.errorMessage = error;
    }

    get errorMsg() {
        return this.errorMessage;
    }

    get topPlayers(): IPlayerLeaderboard['topPlayers'] | null {
        this.getTopPlayers();

        const sortedPlayers = this.leaderboard?.topPlayers?.slice().sort((a, b) => b.scorePercentage - a.scorePercentage) || [];

        const uniquePlayers: ITopPlayer[] = [];

        sortedPlayers.forEach((player) => {
            const found = uniquePlayers.find((uniquePlayer) => uniquePlayer.userName === player.userName);
            if (!found) {
                uniquePlayers.push(player);
            } else if (found.scorePercentage < player.scorePercentage) {
                uniquePlayers[uniquePlayers.indexOf(found)] = player;
            }
        });

        return uniquePlayers.slice(0, 10);
    }


    reset() {
        this.currentState = 'pending';
        this.errorMsg = '';
        this.data = {gameId: 0, checkRequests: []};
        this.leaderboard = null;
        this.finishState = 'pending';
        this.finalData = null;
    }

    initGame(quantity: number) {
        this.currentState = 'loading';
        gameService
            .initGame(quantity)
            .then(this.initGameSuccess, this.initGameFailure);
    }

    initGameSuccess = ({data}: AxiosResponse<IGameData>) => {
        this.data = data;
        this.currentState = 'success';
    };

    initGameFailure = ({response}: AxiosError<string>) => {
        this.currentState = 'error';
        this.errorMsg = response?.data || 'Failed to initialize the game';
    };

    finishGame(gameId: number, analysis: IGameAnalysis) {
        this.finishState = 'loading';
        gameService
            .finishGame(gameId, analysis)
            .then(this.finishGameSuccess, this.finishGameFailure);
    }

    finishGameSuccess = ({data}: AxiosResponse<IGameFinishResponse>) => {
        this.finishState = 'success';
        console.log(data.message);
    };

    finishGameFailure = ({response}: AxiosError<string>) => {
        this.finishState = 'error';
        this.errorMsg = response?.data || 'Failed to finish the game';
    };

    getTopPlayers() {
        this.currentState = 'loading';
        gameService
            .getTopPlayers()
            .then(this.getTopPlayersSuccess, this.getTopPlayersFailure);
    }

    getTopPlayersSuccess = ({data}: AxiosResponse<IPlayerLeaderboard>) => {
        this.leaderboard = data;
        console.log("data: ", data);
        this.currentState = 'success';
    };

    getTopPlayersFailure = ({response}: AxiosError<string>) => {
        this.currentState = 'error';
        this.errorMsg = response?.data || 'Failed to fetch leaderboard';
    };

}

const gameStore = new GameStore();
export default gameStore;
