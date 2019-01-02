import 'phaser';

type Graphics = Phaser.GameObjects.Graphics;

export class Block {
  public type: BlockType;
  // Grid position x
  public x: number = 0;
  // Grid position y
  public y: number = 0;
  // Rotation: 0 - 3, clockwise
  public rotation: number = 0;

  public constructor(type: BlockType, x: number) {
    this.type = type;
    this.x = x;
  }

  public getFilled(): Array<[number, number]> {
    return blockTypeToCoords(this.type)
      .map(rotated(this.type, this.rotation))
      .map(([relX, relY]) => {
      return [this.x + relX, this.y + relY] as [number, number];
    });
  }

  // Rotates amount * 90 degrees
  public rotate(amount: number) {
    this.rotation += amount;
    this.rotation %= 4;
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
function blockTypeToCoords(type: BlockType): Array<[number, number]> {
  switch (type) {
    case BlockType.I:
      return [[0, 0], [0, 1], [0, 2], [0, 3]];
    case BlockType.O:
      return [[-1, 0], [-1, 1], [0, 0], [0, 1]];
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

function blockTypeCenterOfRotation(
    type: BlockType): [number, number] | undefined {
  switch (type) {
    case BlockType.I:
      return [0, 2];
    case BlockType.O:
      return undefined;
    case BlockType.T:
      return [0, 0];
    case BlockType.J:
      return [0, 1];
    case BlockType.L:
      return [0, 1];
    case BlockType.S:
      return [0, 0];
    case BlockType.Z:
      return [0, 0];
  }
}

function rotated(type: BlockType, times: number
    ): ([x, y]: [number, number]) => [number, number] {
  const centerOfRotation = blockTypeCenterOfRotation(type);
  if (centerOfRotation) {
    const [centerX, centerY] = centerOfRotation;
    return ([x, y]: [number, number]) => {
      let relX = x - centerX;
      let relY = y - centerY;
      for (let i = 0; i < times; i++) {
        const newY = relX;
        const newX = -relY;
        relX = newX;
        relY = newY;
      }
      return [relX + centerX, relY + centerY];
    };
  }
  // Cannot rotate
  else {
    return (coord) => coord;
  }
}

export function randomBlockType(): BlockType {
  return Math.floor(Math.random() * typeCount);
}
