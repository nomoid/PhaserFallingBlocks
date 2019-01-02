export const gridWidth = 10;
export const gridHeight = 20;

export class Grid {
  // Holds all tiles that are permanently in the grid
  public spaces: boolean[][] = populateGrid();

  // Returns an array of spaces that are filled in the grid
  public getFilled(): Array<[number, number]> {
    return allCoords().filter(([x, y]) => this.spaces[x][y]);
  }

  public getEmpty(): Array<[number, number]> {
    return allCoords().filter(([x, y]) => !this.spaces[x][y]);
  }

  public fill(coords: Array<[number, number]>) {
    for (const [x, y] of coords) {
      this.spaces[x][y] = true;
    }
  }

  public tryClear() {
    // Start from bottom row
    for (let i = gridHeight - 1; i >= 0; i--) {
      // Check if row is filled
      let full = true;
      for (let j = 0; j < gridWidth; j++) {
        if (!this.spaces[j][i]) {
          full = false;
        }
      }
      // If row is filled, clear and shift everything down
      if (full) {
        for (let k = i - 1; k >= 0; k--) {
          for (let j = 0; j < gridWidth; j++) {
            this.spaces[j][k + 1] = this.spaces[j][k];
          }
        }
      }
    }
  }
}

// Populate an empty grid
function populateGrid(): boolean[][] {
  const f = (width: number, height: number) => {
    const arr: boolean[][] = [];
    for (let i = 0; i < width; i++) {
      arr.push([]);
      for (let j = 0; j < height; j++) {
        arr[i].push(false);
      }
    }
    return arr;
  };
  return f(gridWidth, gridHeight);
}

export function allCoords(): Array<[number, number]> {
  const f = (width: number, height: number) => {
    const coords: Array<[number, number]> = [];
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        coords.push([i, j]);
      }
    }
    return coords;
  };
  return f(gridWidth, gridHeight);
}
