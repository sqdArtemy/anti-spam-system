import {axiosInstance} from '../axios';
import {IAnalysisResponse} from "../interfaces/responses/analysis";

export class AnalysisService {

    public analyze = async (
        text: string | null,
        image: File | null,
        wordNumber: string
    ) => {
        const url = '/analyze';
        const formData = new FormData();
        if (text)
            formData.append('text', text);
        if (image)
            formData.append('image', image);
        formData.append('word_number', wordNumber);


        return axiosInstance.post<IAnalysisResponse>(url, formData);
    };

}

export const analysisService = new AnalysisService();