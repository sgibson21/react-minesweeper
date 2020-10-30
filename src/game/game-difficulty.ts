import { Difficulty } from "./game-types"

const Easy: Difficulty = {
    label: 'Easy',
    width: 10,
    height: 10,
    mines: 20,
};

const Medium: Difficulty = {
    label: 'Medium',
    width: 15,
    height: 15,
    mines: 40,
};

const Hard: Difficulty = {
    label: 'Hard',
    width: 20,
    height: 20,
    mines: 50,
};

const difficulties: { [key:string]: Difficulty } = {
    Easy,
    Medium,
    Hard,
};

export default difficulties;
