const GRID_HEIGHT = 20;
const GRID_WIDTH = 20;


const SPACE_SIZE = 15; // 15 pixels

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.beginPath();
ctx.fillStyle = "black";
ctx.fillRect(0, 0, 600, 600);

class Graph {
  constructor(height, width) {
    this.grid = [];
    this.edges = {};
    for (let i = 0; i < GRID_HEIGHT; i++) {
      let row = [];
      for (let j = 0; j < GRID_WIDTH; j++) {
        row.push(0);
        this.edges[Graph.getNodeId(i, j)] = {
          up: true,
          down: true,
          right: true,
          left: true,
        };
      }
      this.grid.push(row);
    }
  }

  static getNodeId(i, j) {
    return i + "," + j;
  }

  static drawNode(row, col, color) {
    let verticalOffset = (row * SPACE_SIZE) * 2;
    let horizontalOffset = (col * SPACE_SIZE) * 2;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(horizontalOffset, verticalOffset, SPACE_SIZE, SPACE_SIZE);
    ctx.stroke();
  }

  getNeighbors(row, col) {
    let res = []
    const directions = this.edges[Graph.getNodeId(row, col)];
    if (directions.up) {
      res.push([row - 1, col])
    }

    if (directions.down) {
      res.push([row + 1, col])
    }

    if (directions.left) {
      res.push([row, col - 1])
    }

    if (directions.right) {
      res.push([row, col + 1])
    }

    return res;
  }

  draw() {
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[0].length; j++) {
        let verticalOffset = (i * SPACE_SIZE) * 2;
        let horizontalOffset = (j * SPACE_SIZE) * 2;

        // draw node
        Graph.drawNode(i, j, 'purple');

        // draw its edges
        let neighbors = this.edges[Graph.getNodeId(i, j)];

        // up
        ctx.beginPath();
        ctx.fillStyle = neighbors.up ? "white" : "black";
        ctx.fillRect(horizontalOffset, verticalOffset - SPACE_SIZE, SPACE_SIZE, SPACE_SIZE);
        ctx.stroke();

        // down
        ctx.beginPath();
        ctx.fillStyle = neighbors.down ? "white" : "black";
        ctx.fillRect(horizontalOffset, verticalOffset + SPACE_SIZE, SPACE_SIZE, SPACE_SIZE);
        ctx.stroke();

        // left 
        ctx.beginPath();
        ctx.fillStyle = neighbors.left ? "white" : "black";
        ctx.fillRect(horizontalOffset - SPACE_SIZE, verticalOffset, SPACE_SIZE, SPACE_SIZE);
        ctx.stroke();

        // right 
        ctx.beginPath();
        ctx.fillStyle = neighbors.right ? "white" : "black";
        ctx.fillRect(horizontalOffset + SPACE_SIZE, verticalOffset, SPACE_SIZE, SPACE_SIZE);
        ctx.stroke();
      }
    }
  }

  generateMaze() {
    const start = Graph.getNodeId(0, 0);
    let tree = Set([start]);
    // let frontierEdges = [this.getNeighbors[start]];
    const getUnvisitedNeighbors = (node) => {
      // TODO
    };

    while (tree.size < GRID_WIDTH * GRID_HEIGHT) {

    }

  }
}

const g = new Graph();

console.log(g.getNeighbors(3, 4)); // [ [2, 4], [3, 3], [4, 5], [3, 5]   ]

// g.edges[Graph.getNodeId(3, 6)] = {
//   up: true,
//   down: true,
//   left: false,
//   right: false,
// }
//console.log(g);
// g.grid[3][5] = 1
// g.grid[3][6] = 1
// console.log(g.edges)




g.draw()
// ctx.beginPath();
// ctx.fillStyle = 'blue';
// ctx.fillRect(20, 20, 100, 100);
// ctx.stroke();
