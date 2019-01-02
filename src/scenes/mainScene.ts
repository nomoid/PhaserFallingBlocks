import 'phaser';
import { Block, BlockType, randomBlockType } from '../block';
import { screenHeight, screenWidth } from '../game';
import { Grid, gridHeight, gridWidth } from '../grid';

import phaserPng from '../assets/phaser.png';

type Graphics = Phaser.GameObjects.Graphics;

// Size of a grid space
const worldScale = 25;
// Size of line between blocks
const gridLineWidth = 2;
// 0, 0 of grid is top left corner
let worldOffsetX: number;
let worldOffsetY: number;

export class MainScene extends Phaser.Scene {
  private image!: Phaser.GameObjects.Image;
  private graphics!: Graphics;
  private block!: Block;
  private grid!: Grid;

  constructor() {
    super({ key: 'MainScene' });

    worldOffsetX = screenWidth / 2 - (worldScale * gridWidth) / 2;
    worldOffsetY = screenHeight / 2 - (worldScale * gridHeight) / 2;
  }

  public preload() {
    this.load.image('phaser', phaserPng);
  }

  public create() {
    this.graphics = this.add.graphics();

    this.block = new Block(randomBlockType(), gridWidth / 2);
    this.grid = new Grid();

    this.input.on('pointerdown', (event: any) => {
      this.block = new Block(randomBlockType(), gridWidth / 2);
    });

  }

  public update() {
    this.render();
  }

  private render() {
    const graphics = this.graphics;
    graphics.clear();
    this.renderGrid();
    this.renderBlock();
  }

  private renderBlock() {
    this.block.getFilled().forEach(fillBlocks(this.graphics, 0x0000ff));
  }

  private renderGrid() {
    // Render grid lines - do this by rendering complete area as a rectangle
    // and then rendering empty grid spaces
    this.renderGridBackground();
    this.grid.getEmpty().forEach(fillBlocks(this.graphics, 0x000000));
    // Render filled grid spaces
    this.grid.getFilled().forEach(fillBlocks(this.graphics, 0x00007f));
  }

  private renderGridBackground() {
    const graphics = this.graphics;
    const [startX, startY] = gridToWorldPos(0, 0);
    const [endX, endY] = gridToWorldPos(gridWidth, gridHeight);
    const width = endX - startX;
    const height = endY - startY;
    graphics.fillStyle(0x3f3f3f, 1);
    graphics.fillRect(startX, startY, width, height);
  }
}

function gridToWorldPos(x: number, y: number): [number, number] {
  return [x * worldScale + worldOffsetX, y * worldScale + worldOffsetY];
}

function fillBlocks(graphics: Graphics, rgb: number) {
  return ([x, y]: [number, number]) => {
    const [worldX, worldY] = gridToWorldPos(x, y);
    graphics.fillStyle(rgb, 1);
    const blockX = worldX + gridLineWidth / 2;
    const blockY = worldY + gridLineWidth / 2;
    const blockSize = worldScale - gridLineWidth;
    graphics.fillRect(blockX, blockY, blockSize, blockSize);
  };
}
