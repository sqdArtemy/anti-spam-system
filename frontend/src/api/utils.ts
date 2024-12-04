export type IResponseObject = { [key: string]: any };

export const snakeToCamel = (obj: IResponseObject): IResponseObject => {
    if (obj instanceof ArrayBuffer) {
        return obj;
    } else if (Array.isArray(obj)) {
        return obj.map((item) => snakeToCamel(item));
    } else if (typeof obj === 'object' && obj !== null) {
        const newObj: IResponseObject = {};
        Object.keys(obj).forEach((key) => {
            const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
                letter.toUpperCase()
            );
            newObj[camelKey] = snakeToCamel(obj[key]);
        });
        return newObj;
    } else {
        return obj;
    }
};

export const camelToSnake = (obj: IResponseObject): IResponseObject => {
    if (obj instanceof FormData) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => camelToSnake(item));
    } else if (typeof obj === 'object' && obj !== null) {
        const newObj: IResponseObject = {};
        Object.keys(obj).forEach((key) => {
            const snakeKey = key.replace(
                /[A-Z]/g,
                (letter) => `_${letter.toLowerCase()}`
            );
            newObj[snakeKey] = camelToSnake(obj[key]);
        });
        return newObj;
    } else {
        return obj;
    }
};

export const getErrorMessage = (obj: IResponseObject): string => {
    for (const key in obj) {
        if (typeof obj[key] === 'string') {
            return obj[key];
        } else if (typeof obj[key] === 'object') {
            const result = getErrorMessage(obj[key]);
            if (result !== null) {
                return result;
            }
        }
    }

    return 'Technical issue';
}