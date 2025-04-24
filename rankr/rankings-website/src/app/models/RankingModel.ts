export interface RankingModel {
    id: number;
    name: string;
    score: number;
    parameters: {
        [key: string]: number; // Dynamic parameters with their respective scores
    };
}