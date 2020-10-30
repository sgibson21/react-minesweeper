import React from 'react';
import Grid from '../grid/Grid';
import Timer from '../timer/Timer';
import { cellModel, gridModel } from '../grid/grid-types';
import { GridBuilder } from '../grid/grid-builder';
import { GridNavigator } from '../grid/grid-navigator';
import { GridOpener } from '../grid/grid-opener';
import GameDifficulty from './game-difficulty';

import Dropdown from 'react-bootstrap/Dropdown';
import gameWinImage from '../minesweeper-game-win.png';
import gameOverImage from '../minesweeper-game-over.png';
import './Game.css';
import { Difficulty, GameState } from './game-types';

export default class Game extends React.Component<{}, GameState> {

    private localStorageDifficultyKey = 'DIFFICULTY';

    private gridBuilder: GridBuilder;
    private gridNavigator: GridNavigator;
    private gridOpener: GridOpener;

    private timerElement: React.RefObject<Timer>;

    constructor(props: any) {
        super(props);

        this.gridBuilder = new GridBuilder();
        this.gridNavigator = new GridNavigator();
        this.gridOpener = new GridOpener();

        this.timerElement = React.createRef();

        let difficulty = GameDifficulty.Medium
        if (localStorage.getItem(this.localStorageDifficultyKey)) {
            difficulty = JSON.parse(localStorage.getItem(this.localStorageDifficultyKey) as string);
        }

        this.state = {
            difficulty: difficulty,
            isFirstClick: true,
            gridModel: this.gridBuilder.build(difficulty.width, difficulty.height),
            flagsUsed: 0,
            gameOver: false,
            gameWin: false,
        };
    }

    render() {
        return (
            <div className="game">
                <div className="header-row d-flex justify-content-between">
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {this.state.difficulty.label}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => this.restart(GameDifficulty.Easy)}>{GameDifficulty.Easy.label}</Dropdown.Item>
                            <Dropdown.Item onClick={() => this.restart(GameDifficulty.Medium)}>{GameDifficulty.Medium.label}</Dropdown.Item>
                            <Dropdown.Item onClick={() => this.restart(GameDifficulty.Hard)}>{GameDifficulty.Hard.label}</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <div>
                        { !this.state.gameWin && !this.state.gameOver && (<div className="image-placeholder"></div>)}
                        { this.state.gameWin && <img src={gameWinImage} width="50px" alt="" className="game-status-img" onClick={() => this.restart(this.state.difficulty)}/>}
                        { this.state.gameOver && <img src={gameOverImage} width="50px" alt="" className="game-status-img" onClick={() => this.restart(this.state.difficulty)}/>}
                        <span>
                            <span>{this.state.difficulty.mines - this.state.flagsUsed}</span>
                            <span className="flag d-inline-block"></span>
                        </span>
                    </div>

                    <div>
                        <Timer ref={this.timerElement}/>
                    </div>

                </div>
                <div className="grid-row">
                    <Grid
                        isFirstClick={this.state.isFirstClick}
                        gridModel={this.state.gridModel}
                        gameOver={this.state.gameOver}
                        gameWin={this.state.gameWin}
                        onFirstCellClick={(cell: cellModel) => this.onFirstGridCellClick(cell)}
                        onCellClick={(cell: cellModel) => this.onGridCellClick(cell)}
                        onCellRightClick={(cell: cellModel) => this.onGridCellRightClick(cell)}
                    />
                </div>
            </div>
        );
    }

    private restart(difficulty: Difficulty): void {
        localStorage.setItem(this.localStorageDifficultyKey, JSON.stringify(difficulty));
        this.stopTimer();
        this.resetTimer();
        this.setState({
            difficulty,
            isFirstClick: true,
            gridModel: this.gridBuilder.build(difficulty.width, difficulty.height),
            gameOver: false,
            gameWin: false,
        });
    }

    private onFirstGridCellClick(cell: cellModel): void {
        const coordinate = {x: cell.x, y: cell.y};
        const exclusions = [...this.gridNavigator.getSurroundingCoordinates(coordinate), coordinate];
        const gridModel = this.gridBuilder.distributeMines(
            this.state.gridModel,
            this.state.difficulty.width,
            this.state.difficulty.height,
            this.state.difficulty.mines,
            exclusions
        );

        this.startTimer();

        this.setState({
            gridModel,
            isFirstClick: false,
            flagsUsed: this.gridBuilder.countFlags(this.state.gridModel),
        });
    }

    private onGridCellClick(cell: cellModel): void {
        if (cell.isMine) {
            this.stopTimer();
            this.setState({ gameOver: true });
        } else if (!cell.open) {
            const newGrid = this.gridOpener.open(this.state.gridModel, cell);
            const gameWin = this.gridBuilder.isWinning(
                this.state.gridModel,
                this.state.difficulty.width,
                this.state.difficulty.height,
                this.state.difficulty.mines
            );
            if (gameWin) {
                this.stopTimer();
            }
            this.setState({
                gridModel: newGrid,
                flagsUsed: this.gridBuilder.countFlags(this.state.gridModel),
                gameWin,
            });
        }
    }

    private onGridCellRightClick(cell: cellModel): void {
        const newCell: cellModel = {...cell, isFlag: !cell.isFlag};
        const gridModel: gridModel = { ...this.state.gridModel };
        gridModel[cell.y][cell.x] = newCell;
        this.setState({
            gridModel,
            flagsUsed: this.gridBuilder.countFlags(this.state.gridModel),
        });
    }

    private startTimer(): void {
        this.timerElement.current?.startTimer();
    }

    private stopTimer(): void {
        this.timerElement.current?.stopTimer();
    }

    private resetTimer(): void {
        this.timerElement.current?.resetTimer();
    }

}
