import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { COLORS } from '../constants/Theme';

const { width } = Dimensions.get('window');
export const GRID_SIZE = 4;
export const PADDING = 12;
export const GAP = 8;
export const CONTAINER_SIZE = Math.floor(width - 40);
export const TILE_SIZE = Math.floor((CONTAINER_SIZE - (PADDING * 2) - (GAP * (GRID_SIZE - 1))) / GRID_SIZE);

export const Grid2048 = () => {
  const cells = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const x = PADDING + c * (TILE_SIZE + GAP);
      const y = PADDING + r * (TILE_SIZE + GAP);
      cells.push(
        <View 
          key={`${r}-${c}`} 
          style={[styles.cell, { left: x, top: y }]} 
        />
      );
    }
  }

  return (
    <View style={styles.container}>
      {cells}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CONTAINER_SIZE,
    height: CONTAINER_SIZE,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  cell: {
    position: 'absolute',
    width: TILE_SIZE,
    height: TILE_SIZE,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
});
