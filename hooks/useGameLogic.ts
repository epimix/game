import { useState, useCallback, useEffect } from 'react';
import { SHAPES, ShapeDefinition, Point, getRandomShape } from '../constants/Shapes';
import { SIZES } from '../constants/Theme';
import * as Haptics from 'expo-haptics';

export type GridState = (number | null)[][];

export const useGameLogic = () => {
  const [grid, setGrid] = useState<GridState>(
    Array(SIZES.GRID_SIZE).fill(null).map(() => Array(SIZES.GRID_SIZE).fill(null))
  );
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currentShapes, setCurrentShapes] = useState<[ShapeDefinition | null, ShapeDefinition | null, ShapeDefinition | null]>([
    getRandomShape(),
    getRandomShape(),
    getRandomShape()
  ]);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (currentShapes.every(s => s === null)) {
      setCurrentShapes([getRandomShape(), getRandomShape(), getRandomShape()]);
    }
  }, [currentShapes]);

  useEffect(() => {
    const hasAnyMove = currentShapes.some(shape => {
      if (!shape) return false;
      
      for (let r = 0; r < SIZES.GRID_SIZE; r++) {
        for (let c = 0; c < SIZES.GRID_SIZE; c++) {
          if (canPlaceShape(shape, r, c, grid)) return true;
        }
      }
      return false;
    });

    if (!hasAnyMove && !currentShapes.every(s => s === null)) {
      setIsGameOver(true);
    }
  }, [grid, currentShapes]);

  const canPlaceShape = (shape: ShapeDefinition, row: number, col: number, currentGrid: GridState): boolean => {
    return shape.points.every(([dx, dy]) => {
      const nr = row + dy;
      const nc = col + dx;
      return (
        nr >= 0 && nr < SIZES.GRID_SIZE &&
        nc >= 0 && nc < SIZES.GRID_SIZE &&
        currentGrid[nr][nc] === null
      );
    });
  };

  const placeShape = useCallback((shapeIndex: number, row: number, col: number) => {
    const shape = currentShapes[shapeIndex];
    if (!shape) return false;

    if (canPlaceShape(shape, row, col, grid)) {
      const newGrid = grid.map(r => [...r]);
      shape.points.forEach(([dx, dy]) => {
        newGrid[row + dy][col + dx] = shape.colorIndex;
      });

      let rowsToClear: number[] = [];
      let colsToClear: number[] = [];

      for (let r = 0; r < SIZES.GRID_SIZE; r++) {
        if (newGrid[r].every(cell => cell !== null)) rowsToClear.push(r);
      }

      for (let c = 0; c < SIZES.GRID_SIZE; c++) {
        let isFull = true;
        for (let r = 0; r < SIZES.GRID_SIZE; r++) {
          if (newGrid[r][c] === null) {
            isFull = false;
            break;
          }
        }
        if (isFull) colsToClear.push(c);
      }

      rowsToClear.forEach(r => {
        for (let c = 0; c < SIZES.GRID_SIZE; c++) newGrid[r][c] = null;
      });
      colsToClear.forEach(c => {
        for (let r = 0; r < SIZES.GRID_SIZE; r++) newGrid[r][c] = null;
      });

      const shapesPlacedScore = shape.points.length;
      const linesCleared = rowsToClear.length + colsToClear.length;
      let clearScore = 0;
      if (linesCleared > 0) {
        clearScore = (linesCleared * 10) * linesCleared;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      setGrid(newGrid);
      setScore(prev => {
        const newScore = prev + shapesPlacedScore + clearScore;
        if (newScore > highScore) setHighScore(newScore);
        return newScore;
      });

      const newShapes = [...currentShapes] as [ShapeDefinition | null, ShapeDefinition | null, ShapeDefinition | null];
      newShapes[shapeIndex] = null;
      setCurrentShapes(newShapes);

      return true;
    }
    return false;
  }, [grid, currentShapes, highScore]);

  const restartGame = () => {
    setGrid(Array(SIZES.GRID_SIZE).fill(null).map(() => Array(SIZES.GRID_SIZE).fill(null)));
    setScore(0);
    setCurrentShapes([getRandomShape(), getRandomShape(), getRandomShape()]);
    setIsGameOver(false);
  };

  return {
    grid,
    score,
    highScore,
    currentShapes,
    isGameOver,
    placeShape,
    canPlaceShape,
    restartGame
  };
};
