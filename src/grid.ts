export const gridWidth = 10;
export const gridHeight = 20;

export class Grid {
  // Holds all tiles that are permanently in the grid
  public spaces: boolean[][] = populateGrid(gridWidth, gridHeight);

  // Returns an array of spaces that are filled in the grid
  public getFilled(): Array<[number, number]> {
    const coords: Array<[number, number]> = [];
    for (let i = 0; i < gridWidth; i++) {
      for (let j = 0; j < gridHeight; j++) {
        if (this.spaces[i][j]) {
          coords.push([i, j]);
        }
      }
    }
    return coords;
  }
}

// Populate an empty grid
function populateGrid(width: number, height: number): boolean[][] {
  const arr: boolean[][] = [];
  for (let i = 0; i < width; i++) {
    arr.push([]);
    for (let j = 0; j < height; j++) {
      arr[i].push(false);
    }
  }
  return arr;
}
