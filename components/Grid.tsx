import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { COLORS, SIZES } from '../constants/Theme';
import { Block } from './Block';
import { GridState } from '../hooks/useGameLogic';
import { ShapeDefinition } from '../constants/Shapes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_PADDING = 16;
const GRID_WIDTH = SCREEN_WIDTH - GRID_PADDING * 2;
const CELL_SIZE = (GRID_WIDTH - (SIZES.GRID_SIZE + 1) * SIZES.CELL_GAP) / SIZES.GRID_SIZE;

interface GridProps {
  gridState: GridState;
  previewShape?: {
    shape: ShapeDefinition;
    row: number;
    col: number;
  } | null;
}

export const Grid: React.FC<GridProps> = ({ gridState, previewShape }) => {
  const isPreviewCell = (r: number, c: number) => {
    if (!previewShape) return false;
    const { shape, row, col } = previewShape;
    return shape.points.some(([dx, dy]) => row + dy === r && col + dx === c);
  };

  return (
    <View style={styles.container}>
      {gridState.map((row, r) => (
        <View key={`row-${r}`} style={styles.row}>
          {row.map((cell, c) => (
            <Block
              key={`cell-${r}-${c}`}
              size={CELL_SIZE}
              colorIndex={cell}
              isPreview={isPreviewCell(r, c)}
              previewColorIndex={previewShape?.shape.colorIndex}
              style={styles.cell}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: GRID_WIDTH,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: SIZES.BORDER_RADIUS,
    padding: SIZES.CELL_GAP,
    gap: SIZES.CELL_GAP,
  },
  row: {
    flexDirection: 'row',
    gap: SIZES.CELL_GAP,
  },
  cell: {
  },
});

export { CELL_SIZE, GRID_WIDTH, GRID_PADDING };
