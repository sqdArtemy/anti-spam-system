import {makeAutoObservable} from 'mobx';
import {AxiosError, AxiosResponse} from 'axios';
import {analysisService} from '../api/services/analysisService';
import {IAnalysisResponse} from '../api/interfaces/responses/analysis';

class AnalysisStore {
    state: 'pending' | 'loading' | 'success' | 'error' = 'pending';
    errorMessage: string = '';
    _analysisData: IAnalysisResponse = {} as IAnalysisResponse;
    _imagePreview: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    // Getters and Setters
    set analysisData(data: IAnalysisResponse) {
        this._analysisData = data;
    }

    set imagePreview(data: string | null) {
        this._imagePreview = data;
    }

    set currentState(state: 'pending' | 'loading' | 'success' | 'error') {
        this.state = state;
    }


    analyze(
        text: string | null,
        image: File | null,
        wordNumber: string
    ) {
        this.currentState = 'loading';

        analysisService
            .analyze(text, image, wordNumber)
            .then(this.analyzeSuccess, this.analyzeFailure);
    }


    analyzeSuccess = ({data}: AxiosResponse<IAnalysisResponse>) => {
        this.analysisData = data;
        this.currentState = 'success';
        // this.previewImage(data.image_path);
    };


    analyzeFailure = ({response}: AxiosError<string>) => {
        this.currentState = 'error';
        this.errorMessage = response?.data || 'Something went wrong';
    };


    previewImage(imagePath: string | null) {
        if (imagePath) {
            // Handle image preview logic
            this.imagePreview = imagePath;
        }
    }


    reset() {
        this.state = 'pending';
        this.errorMessage = '';
        this._analysisData = {} as IAnalysisResponse;
        this._imagePreview = null;
    }

}

const analysisStore = new AnalysisStore();
export default analysisStore;
