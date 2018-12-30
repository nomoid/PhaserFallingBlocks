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

  public constructor(type: BlockType) {
    this.type = type;
  }

  public fill(filler: (x: number, y: number) => void) {
    blockTypeToCoords(this.type).forEach(([relX, relY]) => {
      filler(this.x + relX, this.y + relY);
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
      return [[0, -1], [0, 0], [0, 1], [0, 2]];
    case BlockType.O:
      return [[0, 0], [0, 1], [1, 1], [1, 0]];
    case BlockType.T:
      return [[-1, 0], [0, 0], [1, 0], [0, 1]];
    case BlockType.J:
      return [[0, -1], [0, 0], [0, 1], [-1, 1]];
    case BlockType.L:
      return [[0, -1], [0, 0], [0, 1], [1, 1]];
    case BlockType.S:
      return [[1, 0], [0, 0], [0, 1], [-1, 1]];
    case BlockType.Z:
      return [[-1, 0], [0, 0], [0, 1], [1, 1]];
  }
}

export function randomBlockType(): BlockType {
  return Math.floor(Math.random() * typeCount);
}
