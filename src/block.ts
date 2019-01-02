import 'phaser';

type Graphics = Phaser.GameObjects.Graphics;

export class Block {
  public type: BlockType;
  // Grid position x
  public x: number = 0;
  // Grid position y
  public y: number = 0;
  // Rotation
  public rotation: number = 0;

  public constructor(type: BlockType, x: number) {
    this.type = type;
    this.x = x;
  }

  public getFilled(): Array<[number, number]> {
    return blockTypeToCoords(this.type).map(([relX, relY]) => {
      return [this.x + relX, this.y + relY] as [number, number];
    });
  }
}

// Tetromino types

const typeCount = 7;

export enum BlockType {
  I,
  O,
  T,
  J,
  L,
  S,
  Z
}

// Positive y is down
// Positive x is right
export function blockTypeToCoords(type: BlockType): Array<[number, number]> {
  switch (type) {
    case BlockType.I:
      return [[0, 0], [0, 1], [0, 2], [0, 3]];
    case BlockType.O:
      return [[0, 0], [0, 1], [1, 1], [1, 0]];
    case BlockType.T:
      return [[-1, 0], [0, 0], [1, 0], [0, 1]];
    case BlockType.J:
      return [[0, 0], [0, 1], [0, 2], [-1, 2]];
    case BlockType.L:
      return [[0, 0], [0, 1], [0, 2], [1, 2]];
    case BlockType.S:
      return [[1, 0], [0, 0], [0, 1], [-1, 1]];
    case BlockType.Z:
      return [[-1, 0], [0, 0], [0, 1], [1, 1]];
  }
}

export function randomBlockType(): BlockType {
  return Math.floor(Math.random() * typeCount);
}

export function coordIndexOf(coords: Array<[number, number]>,
    [x, y]: [number, number]): number {
  for (let i = 0; i < coords.length; i++) {
    const [elemX, elemY] = coords[i];
    if (x === elemX && y === elemY) {
      return i;
    }
  }
  return -1;
}
