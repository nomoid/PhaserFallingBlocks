import 'phaser';
import { Block, randomBlockType, coordIndexOf } from '../block';
import { screenWidth, screenHeight } from '../game';
import { Grid, allCoords, gridWidth, gridHeight } from '../grid';

import phaserPng from '../assets/phaser.png';

type Graphics = Phaser.GameObjects.Graphics;

// Size of a grid space
const worldScale = 25;
// Size of line between blocks
const gridLineWidth = 2;
// Initial number of ms between updates
const initialUpdateDelay = 500;
// 0, 0 of grid is top left corner
let worldOffsetX: number;
let worldOffsetY: number;

export class MainScene extends Phaser.Scene {
  private image!: Phaser.GameObjects.Image;
  private graphics!: Graphics;
  private block!: Block;
  private grid!: Grid;
  private updateTimer: number = 0;
  private updateDelay: number = initialUpdateDelay;

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

    this.makeNewBlock();
    this.grid = new Grid();

    this.input.on('pointerdown', (event: any) => {
      this.makeNewBlock();
    });
  }

  public update(time: number, delta: number) {
    this.render();
    this.updateBlock(delta);
  }

  private makeNewBlock() {
    this.block = new Block(randomBlockType(), gridWidth / 2);
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
    this.grid.getFilled().forEach(fillBlocks(this.graphics, 0x7f7fff));
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

  private updateBlock(delta: number) {
    this.updateTimer += delta;
    while (this.updateTimer >= this.updateDelay) {
      this.updateTimer -= this.updateDelay;
      this.executeUpdate();
    }
  }

  private executeUpdate() {
    // Move the block down and check if a collision occurs
    this.block.y += 1;
    // If one does, move the block back and freeze it
    if (!this.checkBlockValid()) {
      this.block.y -= 1;
      this.grid.fill(this.block.getFilled());
      this.makeNewBlock();
    }
  }

  // false: invalid space
  private checkBlockValid(): boolean {
    const blockSpaces = this.block.getFilled();
    const validCoords = allCoords();
    const outOfBoundsSpaces =
      blockSpaces.filter(([x, y]) => coordIndexOf(validCoords, [x, y]) < 0);
    if (outOfBoundsSpaces.length > 0) {
      return false;
    }
    const gridSpaces = this.grid.getFilled();
    const overlapSpaces =
      blockSpaces.filter(([x, y]) => coordIndexOf(gridSpaces, [x, y]) >= 0);
    if (overlapSpaces.length > 0) {
      return false;
    }
    return true;
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
