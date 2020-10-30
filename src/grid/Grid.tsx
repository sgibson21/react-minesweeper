import React from 'react';
import { gridRowModel, cellModel, GridProps } from './grid-types';
import './Grid.css';

export default class Grid extends React.Component<GridProps, {}> {

    renderCell(cell: cellModel) {
        return (
            <div
                key={cell.x}
                className={ `cell ${ cell.open && 'open' }` }
                onClick={() => this.onCellClick(cell)}
                onContextMenu={() => this.onCellRightClick(cell)}
            >
                {cell.open && cell.proximityCount > 0 && <span>{cell.proximityCount}</span>}
                {cell.isFlag && <span className="flag"></span>}
                {this.props.gameOver && !cell.isFlag && cell.isMine && <span className="mine"></span>}
            </div>
        );
    }

    renderRow(y: number, row: gridRowModel) {
        const cells = Object.values(row);
        return (
            <div key={y} className="row">
                {cells.map(cell => this.renderCell(cell))}
            </div>
        );
    }

    render() {
        const rows = Object.values(this.props.gridModel);
        return (
            <div
                className="grid"
                onContextMenu={event => event.preventDefault()}
            >{rows.map((row, y) => this.renderRow(Number(y), row))}</div>
        );
    }

    private onCellClick(cell: cellModel): void {
        if (!this.props.gameOver && !this.props.gameWin) {
            if (this.props.isFirstClick) {
                this.props.onFirstCellClick(cell);
            }
            
            if (!cell.isFlag) {
                this.props.onCellClick(cell);
            }
        }
    }

    private onCellRightClick(cell: cellModel): void {
        if (!this.props.gameOver && !cell.open) {
            this.props.onCellRightClick(cell);
        }
    }

}
