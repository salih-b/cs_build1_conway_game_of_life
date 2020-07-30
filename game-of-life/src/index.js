import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ButtonToolbar, DropdownButton} from 'react-bootstrap';
import { Dropdown } from 'react-bootstrap';

// 
class Box extends React.Component {
	selectBox = () => {
		this.props.selectBox(this.props.row, this.props.col);
	}

	render() {
		return (
			<div
				className={this.props.boxClass}
				id={this.props.id}
				onClick={this.selectBox}
			/>
		);
	}
}
// end box class

// 
class Grid extends React.Component {
	render() {
		const width = (this.props.cols * 14);
		var rowsArr = [];

		var boxClass = "";
		for (var i = 0; i < this.props.rows; i++) {
			for (var j = 0; j < this.props.cols; j++) {
				let boxId = i + "_" + j;

				boxClass = this.props.gridFull[i][j] ? "box on" : "box off";
				rowsArr.push(
					<Box
						boxClass={boxClass}
						key={boxId}
						boxId={boxId}
						row={i}
						col={j}
						selectBox={this.props.selectBox}
					/>
				);
			}
		}

		return (
			<div className="grid" style={{width: width}}>
				{rowsArr}
			</div>
		);
	}
}
// Grid Component Ends 

// 
class Buttons extends React.Component {
// ##################
	handleSelect = (evt) => {
		this.props.gridSize(evt);
  }
  handlePreset = (evt) => {
    if (evt === "1"){
      this.props.preset_1();
    }
    else if (evt === "2"){
      this.props.preset_2();
    }
    else if (evt === "3"){
      this.props.preset_3();
    }
	}

	render() {
		return (
			<div className="center">
				<ButtonToolbar>
					<button className="btn btn-default" onClick={this.props.playButton}>
						Play
					</button>
					<button className="btn btn-default" onClick={this.props.pauseButton}>
					  Pause
					</button>
					<button className="btn btn-default" onClick={this.props.clear}>
					  Clear
					</button>
					<button className="btn btn-default" onClick={this.props.slow}>
					  Slow
					</button>
					<button className="btn btn-default" onClick={this.props.fast}>
					  Fast
					</button>
					<button className="btn btn-default" onClick={this.props.seed}>
					  Random Seed
					</button>
    
					<DropdownButton
						title="Grid Size"
            className="btn"
						id="size-menu"
						onSelect={this.handleSelect}
					>
						<Dropdown.Item eventKey="1">20x10</Dropdown.Item>
						<Dropdown.Item eventKey="2">50x30</Dropdown.Item>
						<Dropdown.Item eventKey="3">70x50</Dropdown.Item>
					</DropdownButton>
          {/* second drop down  */}
          <DropdownButton
						title="Pre-Sets"
						id="size-menu"
            className="btn"
						onSelect={this.handlePreset}
					>
						<Dropdown.Item eventKey="1">Blinker</Dropdown.Item>
						<Dropdown.Item eventKey="2">Spaceship</Dropdown.Item>
						<Dropdown.Item eventKey="3">Toad</Dropdown.Item>
					</DropdownButton>
				</ButtonToolbar>
			</div>
			)
	}
}
// End Button class


// 
class Main extends React.Component {
	constructor() {
		super();
		this.speed = 100;
		this.rows = 30;
		this.cols = 50;

		this.state = {
			generation: 0,
			gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false))
		}
  }
  
  selectBox = (row, col) => {
    let gridCopy = arrayClone(this.state.gridFull);
    gridCopy[row][col] = !gridCopy[row][col];
    this.setState({
      gridFull:gridCopy
    });
    console.log(gridCopy);
  }
  seed = () => {
		let gridCopy = arrayClone(this.state.gridFull);
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				if (Math.floor(Math.random() * 4) === 1) {
          gridCopy[i][j] = true;
				}
			}
		}
		this.setState({
			gridFull: gridCopy
		});
	}

	playButton = () => {
		clearInterval(this.intervalId);
		this.intervalId = setInterval(this.play, this.speed);
	}

	pauseButton = () => {
		clearInterval(this.intervalId);
	}

	slow = () => {
		this.speed = 1000;
		this.playButton();
	}

	fast = () => {
		this.speed = 100;
		this.playButton();
	}

	clear = () => {
		var grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
		this.setState({
			gridFull: grid,
			generation: 0
    });
    this.pauseButton();
	}

  //  ######################
	gridSize = (size) => {
		switch (size) {
			case "1":
				this.cols = 20;
				this.rows = 10;
			break;
			case "2":
				this.cols = 50;
				this.rows = 30;
			break;
			default:
				this.cols = 70;
				this.rows = 50;
		}
		this.clear();

  }
  
  

  preset_1 = () => {
    this.clear();
		let gridCopy = arrayClone(this.state.gridFull);
    let midRowIndex = gridCopy.length/2
    let midRow = gridCopy[midRowIndex];
    let midCol = (midRow.length /2)
    midRow[midCol] = true;
    midRow[midCol-1] = true;
    midRow[midCol+1] = true;
		this.setState({
			gridFull: gridCopy
		});
  }
  
  preset_2 = () => {
    this.clear();
		let gridCopy = arrayClone(this.state.gridFull);
    let midRowIndex = gridCopy.length/2
    let midRow = gridCopy[midRowIndex];
    let midCol = (midRow.length /2)
    for (let i = 0; i < 6; i++) {
      midRow[midCol-i] = true;
    }
    for (let i = 1; i < 5; i++){
      gridCopy[midRowIndex+1][midCol-i] = true;
    }
    for (let i = 2; i < 6; i++){
      gridCopy[midRowIndex-1][midCol] = true;
      gridCopy[midRowIndex-1][midCol+1] = true;
      gridCopy[midRowIndex-1][midCol-i] = true;
    }
    for (let i = 0; i < 2; i++){
      gridCopy[midRowIndex-2][midCol-i] = true;
    }
		this.setState({
			gridFull: gridCopy
		});
  }
  preset_3 = () => {
    this.clear();
    console.log("in preset 3")
		let gridCopy = arrayClone(this.state.gridFull);
    let midRowIndex = gridCopy.length/2
    let midRow = gridCopy[midRowIndex];
    let midCol = (midRow.length /2)
    for (let i = 0; i < 3; i++) {
      midRow[midCol-i] = true;
      console.log("in for loop");
    }
    for (let i = 1; i < 4; i++){
      gridCopy[midRowIndex+1][midCol-i] = true;
    }
		this.setState({
			gridFull: gridCopy
    });
    console.log(gridCopy, this.state.gridFull);
	}

	play = () => {
		let g = this.state.gridFull;
		let g2 = arrayClone(this.state.gridFull);

		for (let i = 0; i < this.rows; i++) {
		  for (let j = 0; j < this.cols; j++) {
		    let count = 0;
		    if (i > 0) if (g[i - 1][j]) count++;
		    if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
		    if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
		    if (j < this.cols - 1) if (g[i][j + 1]) count++;
		    if (j > 0) if (g[i][j - 1]) count++;
		    if (i < this.rows - 1) if (g[i + 1][j]) count++;
		    if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
		    if (i < this.rows - 1 && j < this.cols - 1) if (g[i + 1][j + 1]) count++;
		    if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
		    if (!g[i][j] && count === 3) g2[i][j] = true;
		  }
		}
		this.setState({
		  gridFull: g2,
		  generation: this.state.generation + 1
		});

	}

	// componentDidMount() {
	// 	this.seed();
	// 	this.playButton();
  // }
  
  render() {
    return (
      <div className="buildProject">
      <div className="gol">
        <h1> The Game Of Life</h1>
        <Buttons
					playButton={this.playButton}
					pauseButton={this.pauseButton}
					slow={this.slow}
					fast={this.fast}
					clear={this.clear}
					seed={this.seed}
          preset_1={this.preset_1}
          preset_2={this.preset_2}
          preset_3={this.preset_3}
					gridSize={this.gridSize}
				/>
        <h4>Generations: {this.state.generation}</h4>
        <Grid
					gridFull={this.state.gridFull}
					rows={this.rows}
					cols={this.cols}
					selectBox={this.selectBox}
				/>
      </div>
      <div className="gol_info">
        <h2>Game Rules:</h2>
        <ol>
          <li className="gameInfo">Any live cell with fewer than two live neighbours dies, as if by underpopulation.</li>
          <li className="gameInfo">Any live cell with two or three live neighbours lives on to the next generation.</li>
          <li className="gameInfo">Any live cell with more than three live neighbours dies, as if by overpopulation.</li>
          <li className="gameInfo">Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</li>
        </ol>
        <h2>About This Algorithm:</h2>
        <p className="gameInfo"> Gamoe of Life is a cellular automaton devised by the British mathematician John Horton Conway in 1970.
        It is a zero-player game, for the Algorithm two arrays are used: one to hold the current generation, and
         one to calculate its successor. Often 0 and 1 represent dead and live cells, respectively. A
          nested for loop considers each element of the current array in turn, counting the live neighbours
           of each cell to decide whether the corresponding element of the successor array should be 0 or 1.
          The successor array is displayed. For the next iteration, the arrays swap roles so that the 
          successor array in the last iteration becomes the current array in the next iteration.</p>
      </div>
      </div>
    );
  }
}
//  Main Component Ends

function arrayClone(arr){
  return JSON.parse(JSON.stringify(arr));
}


ReactDOM.render(
  <React.StrictMode>
    <Main/>
  </React.StrictMode>,
  document.getElementById('root')
);


