import { coordinate } from './grid-types';

export class GridNavigator {

    public moveNorth({ x, y }: coordinate): coordinate {
        return { x, y: y - 1 };
    }

    public moveNorthEast({ x, y }: coordinate): coordinate {
        return { x: x + 1, y: y - 1};
    }

    public moveEast({ x, y }: coordinate): coordinate {
        return { x: x + 1, y };
    }

    public moveSouthEast({ x, y }: coordinate): coordinate {
        return { x: x + 1, y: y + 1};
    }

    public moveSouth({ x, y }: coordinate): coordinate {
        return { x, y: y + 1 };
    }

    public moveSouthWest({ x, y }: coordinate): coordinate {
        return { x: x - 1, y: y + 1};
    }

    public moveWest({ x, y }: coordinate): coordinate {
        return { x: x - 1, y };
    }

    public moveNorthWest({ x, y }: coordinate): coordinate {
        return { x: x -1, y: y - 1};
    }

    public getSurroundingCoordinates(coordinate: coordinate): coordinate[] {
        return [
            this.moveNorth(coordinate),
            this.moveNorthEast(coordinate),
            this.moveEast(coordinate),
            this.moveSouthEast(coordinate),
            this.moveSouth(coordinate),
            this.moveSouthWest(coordinate),
            this.moveWest(coordinate),
            this.moveNorthWest(coordinate),
        ];
    }

}