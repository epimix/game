import { useState, useCallback, useEffect } from 'react';

export type Tile = {
  id: string;
  value: number;
  row: number;
  col: number;
  mergedFrom?: Tile[];
};

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 4;

export const use2048Logic = () => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [nextId, setNextId] = useState(1);

  const spawnTile = useCallback((currentTiles: Tile[]) => {
    const emptyPositions = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (!currentTiles.find(t => t.row === r && t.col === c)) {
          emptyPositions.push({ r, c });
        }
      }
    }

    if (emptyPositions.length === 0) return currentTiles;

    const { r, c } = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
    const newVal = Math.random() < 0.9 ? 2 : 4;
    
    const id = `tile-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;
    return [...currentTiles, { id, value: newVal, row: r, col: c }];
  }, []);

  const initGame = useCallback(() => {
    let initialTiles: Tile[] = [];
    initialTiles = spawnTile(initialTiles);
    initialTiles = spawnTile(initialTiles);
    setTiles(initialTiles);
    setScore(0);
    setGameOver(false);
  }, [spawnTile]);

  useEffect(() => {
    initGame();
  }, []);

  const move = useCallback((direction: Direction) => {
    if (gameOver) return;

    let moved = false;
    let newScore = score;
    const newTiles: Tile[] = [];
    const mergedIds = new Set<string>();

    const getTileAt = (r: number, c: number, list: Tile[]) => list.find(t => t.row === r && t.col === c);

    const isVertical = direction === 'UP' || direction === 'DOWN';
    const isForward = direction === 'RIGHT' || direction === 'DOWN';

    for (let i = 0; i < GRID_SIZE; i++) {
        const line: Tile[] = [];
        for (let j = 0; j < GRID_SIZE; j++) {
            const r = isVertical ? j : i;
            const c = isVertical ? i : j;
            const t = tiles.find(tile => tile.row === r && tile.col === c);
            if (t) line.push(t);
        }

        if (isForward) line.reverse();

        const newLine: Tile[] = [];
        for (let k = 0; k < line.length; k++) {
            const current = line[k];
            const next = line[k + 1];

            if (next && current.value === next.value) {
                const combinedValue = current.value * 2;
                newScore += combinedValue;
                newLine.push({
                    ...next,
                    value: combinedValue,
                    mergedFrom: [current, next]
                });
                k++; 
                moved = true;
            } else {
                newLine.push({ ...current });
            }
        }

        newLine.forEach((tile, index) => {
            const pos = isForward ? GRID_SIZE - 1 - index : index;
            const newR = isVertical ? pos : i;
            const newC = isVertical ? i : pos;

            if (tile.row !== newR || tile.col !== newC) {
                moved = true;
            }
            newTiles.push({ ...tile, row: newR, col: newC });
        });
    }

    if (moved) {
        const tilesAfterSpawn = spawnTile(newTiles);
        setTiles(tilesAfterSpawn);
        setScore(newScore);
        if (newScore > bestScore) setBestScore(newScore);
        
        if (tilesAfterSpawn.length === GRID_SIZE * GRID_SIZE) {
            let canMove = false;
            for (const t of tilesAfterSpawn) {
                const neighbors = [
                    { r: t.row - 1, c: t.col },
                    { r: t.row + 1, c: t.col },
                    { r: t.row, c: t.col - 1 },
                    { r: t.row, c: t.col + 1 },
                ];
                for (const n of neighbors) {
                    const nt = tilesAfterSpawn.find(tile => tile.row === n.r && tile.col === n.c);
                    if (nt && nt.value === t.value) {
                        canMove = true;
                        break;
                    }
                }
                if (canMove) break;
            }
            if (!canMove) setGameOver(true);
        }
    }
  }, [tiles, gameOver, score, bestScore, spawnTile]);

  return {
    tiles,
    score,
    bestScore,
    gameOver,
    move,
    reset: initGame
  };
};
