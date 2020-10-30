import { gridModel } from "../grid/grid-types";

export interface Difficulty {
    label: string;
    width: number;
    height: number;
    mines: number;
}

export interface GameState {
    difficulty: Difficulty;
    isFirstClick: boolean;
    gridModel: gridModel;
    flagsUsed: number;
    gameOver: boolean;
    gameWin: boolean;
}
