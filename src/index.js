import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'antd';
import 'antd/dist/antd.min.css';
import './index.css';

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { name: squares[a], position: [a, b, c] };
        }
    }
    return null;
}

function Square(props) {
    let index = 0;
    return (
        <button
            key={index++}
            className={props.className}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        const { winner, squares, handleClick } = this.props;
        return <Square
            className={winner && winner.position.includes(i) ? 'square square-winner' : 'square'}
            value={squares[i]}
            onClick={() => handleClick(i)}
        />;
    }

    render() {
        let index = 0;
        return (
            <div>
                {Array(3).fill(0).map(() => <div className="board-row">
                    {Array(3).fill(0).map(() => this.renderSquare(index++))}
                </div>)}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            xIsNext: true,
            coordinate: null,
            order: 'ascend'
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            coordinate: i
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        })
    }

    // 获取坐标值（列号，行号）
    getCoordinate() {
        const { coordinate } = this.state;
        if (coordinate || coordinate === 0) {
            let m = Math.floor(coordinate / 3) + 1;
            let n = coordinate % 3 + 1;
            return '(' + n + ',' + m + ')';
        }
        return;
    }

    // 处理排序
    handleOrder() {
        this.setState({ order: this.state.order === 'ascend' ? 'descend' : 'ascend' });
    }

    render() {
        const { stepNumber, order } = this.state;
        const history = this.state.history;
        const current = history[stepNumber];
        const winner = calculateWinner(current.squares);
        const coordinate = this.getCoordinate();

        const moves = history.map((step, move) => {

            if (move) {
                if (order === 'descend') {
                    move = history.length - move;
                }
                const desc = '第' + move + '次移动';
                return <li key={move}>
                    <Button
                        style={{ fontWeight: move === stepNumber ? 'bold' : 'normal' }}
                        onClick={() => this.jumpTo(move)}
                    >{desc}</Button>
                </li>
            }

            return '';

        });

        let status;
        if (winner) {
            status = winner.name + '获得胜利！';
        } else if (stepNumber === 9) {
            status = '平局';
        } else {
            status = '下一位玩家: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        winner={winner}
                        squares={current.squares}
                        handleClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>
                        <Button 
                            type='primary' 
                            style={{marginRight: 8 }} 
                            onClick={() => this.handleOrder()}
                        >排序</Button>
                        <span>当前是：{order === 'ascend' ? '升序' : '降序'}排列</span>
                    </div>
                    <div>当前坐标： {coordinate}</div>
                    <div>{status}</div>
                    <div>操作记录</div>
                    <ul>{moves}</ul>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
