import { GridNavigator } from './grid-navigator';
import { cellModel, coordinate, gridModel } from './grid-types';

export class GridOpener {

    gridNavigator: GridNavigator;

    constructor() {
        this.gridNavigator = new GridNavigator();
    }

    public open(grid: gridModel, cell: cellModel): gridModel {
        const newGrid = { ...grid };
        return this.openCell(newGrid, cell);
    }

    private openCell(grid: gridModel, cell: cellModel): gridModel {
        if (!cell.isMine && !cell.open) {
            cell.open = true;
            cell.isFlag = false;
            if (cell.proximityCount === 0) {
                grid = this.openNorth(grid, cell);
                grid = this.openNorthEast(grid, cell);
                grid = this.openEast(grid, cell);
                grid = this.openSouthEast(grid, cell);
                grid = this.openSouth(grid, cell);
                grid = this.openSouthWest(grid, cell);
                grid = this.openWest(grid, cell);
                grid = this.openNorthWest(grid, cell);
            }
        }
        return grid;
    }

    private openNorth(grid: gridModel, cell: cellModel): gridModel {
        const newCoordinate = this.gridNavigator.moveNorth({x: cell.x, y: cell.y});
        return this.openCoordinate(grid, newCoordinate);
    }

    private openNorthEast(grid: gridModel, cell: cellModel): gridModel {
        const newCoordinate = this.gridNavigator.moveNorthEast({x: cell.x, y: cell.y});
        return this.openCoordinate(grid, newCoordinate);
    }

    private openEast(grid: gridModel, cell: cellModel): gridModel {
        const newCoordinate = this.gridNavigator.moveEast({x: cell.x, y: cell.y});
        return this.openCoordinate(grid, newCoordinate);
    }

    private openSouthEast(grid: gridModel, cell: cellModel): gridModel {
        const newCoordinate = this.gridNavigator.moveSouthEast({x: cell.x, y: cell.y});
        return this.openCoordinate(grid, newCoordinate);
    }

    private openSouth(grid: gridModel, cell: cellModel): gridModel {
        const newCoordinate = this.gridNavigator.moveSouth({x: cell.x, y: cell.y});
        return this.openCoordinate(grid, newCoordinate);
    }

    private openSouthWest(grid: gridModel, cell: cellModel): gridModel {
        const newCoordinate = this.gridNavigator.moveSouthWest({x: cell.x, y: cell.y});
        return this.openCoordinate(grid, newCoordinate);
    }

    private openWest(grid: gridModel, cell: cellModel): gridModel {
        const newCoordinate = this.gridNavigator.moveWest({x: cell.x, y: cell.y});
        return this.openCoordinate(grid, newCoordinate);
    }

    private openNorthWest(grid: gridModel, cell: cellModel): gridModel {
        const newCoordinate = this.gridNavigator.moveNorthWest({x: cell.x, y: cell.y});
        return this.openCoordinate(grid, newCoordinate);
    }

    private openCoordinate(grid: gridModel, { x, y }: coordinate): gridModel {
        if (grid && grid[y] && grid[y][x]) {
            return this.openCell(grid, grid[y][x]);
        } else {
            return grid;
        }
    }

}
