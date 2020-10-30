import { GridNavigator } from './grid-navigator';
import { gridModel, coordinate, cellModel } from './grid-types';

export class GridBuilder {

    gridNavigator: GridNavigator;

    constructor() {
        this.gridNavigator = new GridNavigator();
    }

    public static isMine(grid: gridModel, { x, y }: coordinate): boolean {
        return grid[y] && grid[y][x] && grid[y][x].isMine;
    }

    public build(width: number, height: number): gridModel {
        const gridModel: gridModel = {};
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (!gridModel[y]) {
                    gridModel[y] = {};
                }
                gridModel[y][x] = {
                    x,
                    y,
                    isMine: false,
                    isFlag: false,
                    proximityCount: 0,
                    open: false,
                };
            }
        }
        return gridModel;
    }

    public distributeMines(gridModel: gridModel, width: number, height: number, count: number, exclusions: coordinate[] = []): gridModel {
        let distributedCount = 0;
        while (distributedCount < count) {
            const { x, y } = this.getRandomCoordinate(width, height);
            if (!GridBuilder.isMine(gridModel, { x, y }) && !exclusions.find(coord => coord.x === x && coord.y === y)) {
                gridModel[y][x].isMine = true;
                distributedCount++;
            }
        }

        this.getGridProximityCounts(gridModel);
        return gridModel;
    }

    public countFlags(gridModel: gridModel): number {
        let count = 0;
        this.forEachCell(gridModel, cell => {
            if (cell.isFlag) {
                count++;
            }
        });
        return count;
    }

    public isWinning(gridModel: gridModel, width: number, height: number, mines: number): boolean {
        return this.countOpenCells(gridModel) === (width * height) - mines;
    }

    private countOpenCells(gridModel: gridModel): number {
        let count = 0;
        this.forEachCell(gridModel, cell => {
            if (cell.open) {
                count++;
            }
        });
        return count;
    }

    private getRandomCoordinate(maxX: number, maxY: number): coordinate {
        const x = Math.floor(Math.random() * maxX);
        const y = Math.floor(Math.random() * maxY);
        return { x, y };
    }

    private getGridProximityCounts(gridModel: gridModel): void {
        this.forEachCell(gridModel, cell => {
            const coordinate = { x: cell.x, y: cell.y };
            if (!GridBuilder.isMine(gridModel, coordinate)) {
                cell.proximityCount = this.getProximityCount(gridModel, coordinate);
            }
        })
    }

    public forEachCell(gridModel: gridModel, callback: (cell: cellModel) => void): void {
        Object.keys(gridModel).forEach(y => {
            Object.keys(gridModel[Number(y)]).forEach(x => {
                callback(gridModel[Number(y)][Number(x)]);
            });
        });
    }

    /**
     * Scans cells around the given coordinate for mines
     * 
     * Order: north, north east, east, south east, south, south west, west, nort west
     */
    private getProximityCount(gridModel: gridModel, coordinate: coordinate): number {
        const north = this.gridNavigator.moveNorth(coordinate);
        const northEast = this.gridNavigator.moveNorthEast(coordinate);
        const east = this.gridNavigator.moveEast(coordinate);
        const southEast = this.gridNavigator.moveSouthEast(coordinate);
        const south = this.gridNavigator.moveSouth(coordinate);
        const southWest = this.gridNavigator.moveSouthWest(coordinate);
        const west = this.gridNavigator.moveWest(coordinate);
        const northWest = this.gridNavigator.moveNorthWest(coordinate);
        return [north, northEast, east, southEast, south, southWest, west, northWest]
            .map(coord => GridBuilder.isMine(gridModel, coord))
            .filter(isMine => isMine === true)
            .length;
    }

}
