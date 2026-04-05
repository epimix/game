export type Point = [number, number];

export interface ShapeDefinition {
  id: string;
  points: Point[];
  colorIndex: number;
}

export const SHAPES: ShapeDefinition[] = [
  // 1x1
  { id: '1x1', points: [[0, 0]], colorIndex: 0 },
  
  // 1x2 - Horizontal and Vertical
  { id: 'h1x2', points: [[0, 0], [1, 0]], colorIndex: 1 },
  { id: 'v1x2', points: [[0, 0], [0, 1]], colorIndex: 1 },

  // 1x3 - Horizontal and Vertical
  { id: 'h1x3', points: [[0, 0], [1, 0], [2, 0]], colorIndex: 2 },
  { id: 'v1x3', points: [[0, 0], [0, 1], [0, 2]], colorIndex: 2 },

  // 1x4 - Horizontal
  { id: 'h1x4', points: [[0, 0], [1, 0], [2, 0], [3, 0]], colorIndex: 3 },
  { id: 'v1x4', points: [[0, 0], [0, 1], [0, 2], [0, 3]], colorIndex: 3 },

  // 1x5 - Horizontal
  { id: 'h1x5', points: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]], colorIndex: 4 },
  { id: 'v1x5', points: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], colorIndex: 4 },

  // 2x2 Square
  { id: 'sq2x2', points: [[0, 0], [1, 0], [0, 1], [1, 1]], colorIndex: 5 },

  // 3x3 Square
  { id: 'sq3x3', points: [
    [0, 0], [1, 0], [2, 0],
    [0, 1], [1, 1], [2, 1],
    [0, 2], [1, 2], [2, 2]
  ], colorIndex: 6 },

  // L-Shapes (different rotations)
  { id: 'l2x2_0', points: [[0, 0], [0, 1], [1, 1]], colorIndex: 0 },
  { id: 'l2x2_1', points: [[0, 0], [1, 0], [1, 1]], colorIndex: 1 },

  // Larger L-Shapes
  { id: 'l3x3_0', points: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]], colorIndex: 2 },
  { id: 'l3x3_1', points: [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]], colorIndex: 3 },
  
  // T-Shapes
  { id: 't3x3_0', points: [[0, 0], [1, 0], [2, 0], [1, 1]], colorIndex: 4 },
  { id: 't3x3_1', points: [[1, 0], [0, 1], [1, 1], [2, 1]], colorIndex: 5 },

  // Small diagonal snippets (Block Blast specific)
  { id: 's2x2_0', points: [[0, 0], [1, 0], [1, 1], [2, 1]], colorIndex: 6 },
  { id: 's2x2_1', points: [[0, 1], [1, 1], [1, 0], [2, 0]], colorIndex: 0 },
];

export const getRandomShape = (): ShapeDefinition => {
  const index = Math.floor(Math.random() * SHAPES.length);
  return SHAPES[index];
};
