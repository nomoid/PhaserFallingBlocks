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
