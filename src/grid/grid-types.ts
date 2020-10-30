export interface GridProps {
    isFirstClick: boolean;
    gridModel: gridModel;
    gameOver: boolean;
    gameWin: boolean;
    onFirstCellClick: (cell: cellModel) => void;
    onCellClick: (cell: cellModel) => void;
    onCellRightClick: (cell: cellModel) => void;
}

export type cellModel = {
    x: number,
    y: number,
    isMine: boolean,
    isFlag: boolean,
    proximityCount: number,
    /**
     * Describes if the cell has been clicked open or not
     */
    open: boolean,
};

export type gridRowModel = {
    [x: number]: cellModel,
};

export type gridModel = {
    [y: number]: gridRowModel,
};

export type coordinate = {
    x: number,
    y: number,
};
