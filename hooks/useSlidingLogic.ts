import { useState, useCallback, useEffect } from 'react';

const SIZE = 4;
const TOTAL_TILES = SIZE * SIZE;

const getInversions = (arr: number[]) => {
  let inversions = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] !== 0 && arr[j] !== 0 && arr[i] > arr[j]) {
        inversions++;
      }
    }
  }
  return inversions;
};

const isSolvable = (arr: number[]) => {
  const inversions = getInversions(arr);
  const emptyIndex = arr.indexOf(0);
  const emptyRowFromBottom = SIZE - Math.floor(emptyIndex / SIZE);
  
  if (SIZE % 2 !== 0) {
    return inversions % 2 === 0;
  } else {
    if (emptyRowFromBottom % 2 === 0) {
      return inversions % 2 !== 0;
    } else {
      return inversions % 2 === 0;
    }
  }
};

const shuffleTiles = () => {
  let arr = Array.from({ length: TOTAL_TILES }, (_, i) => i);
  
  do {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  } while (!isSolvable(arr) || isSorted(arr));
  
  return arr;
};

const isSorted = (arr: number[]) => {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] !== i + 1) return false;
  }
  return arr[TOTAL_TILES - 1] === 0;
};

export const useSlidingLogic = () => {
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const initGame = useCallback(() => {
    setTiles(shuffleTiles());
    setMoves(0);
    setIsWon(false);
  }, []);

  useEffect(() => {
    initGame();
  }, []);

  const handleMove = useCallback((index: number) => {
    if (isWon) return;

    const emptyIndex = tiles.indexOf(0);
    const row = Math.floor(index / SIZE);
    const col = index % SIZE;
    const emptyRow = Math.floor(emptyIndex / SIZE);
    const emptyCol = emptyIndex % SIZE;

    const isAdjacent = (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
                     (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves(prev => prev + 1);
      
      if (isSorted(newTiles)) {
        setIsWon(true);
      }
    }
  }, [tiles, isWon]);

  const moveByDirection = useCallback((direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (isWon) return;

    const emptyIndex = tiles.indexOf(0);
    const emptyRow = Math.floor(emptyIndex / SIZE);
    const emptyCol = emptyIndex % SIZE;

    let targetRow = emptyRow;
    let targetCol = emptyCol;

    if (direction === 'DOWN') targetRow = emptyRow - 1;
    else if (direction === 'UP') targetRow = emptyRow + 1;
    else if (direction === 'RIGHT') targetCol = emptyCol - 1;
    else if (direction === 'LEFT') targetCol = emptyCol + 1;

    if (targetRow >= 0 && targetRow < SIZE && targetCol >= 0 && targetCol < SIZE) {
        const targetIndex = targetRow * SIZE + targetCol;
        handleMove(targetIndex);
    }
  }, [tiles, isWon, handleMove]);

  return {
    tiles,
    moves,
    isWon,
    handleMove,
    moveByDirection,
    reset: initGame
  };
};
