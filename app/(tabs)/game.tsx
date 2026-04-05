import React, { useState, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useGameLogic } from '../../hooks/useGameLogic';
import { Grid, CELL_SIZE, GRID_WIDTH, GRID_PADDING } from '../../components/Grid';
import { DraggableShape } from '../../components/DraggableShape';
import { COLORS, SIZES } from '../../constants/Theme';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, ZoomIn, FadeOut, Layout } from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function GameScreen() {
  const {
    grid,
    score,
    highScore,
    currentShapes,
    isGameOver,
    placeShape,
    canPlaceShape,
    restartGame
  } = useGameLogic();

  const [preview, setPreview] = useState<{
    shapeIndex: number;
    row: number;
    col: number;
  } | null>(null);

  const gridRef = useRef<View>(null);
  const deckSlotRefs = useRef<{ [key: number]: View | null }>({});
  const gridLayoutInternal = useRef<{ gx: number; gy: number } | null>(null);
  const slotLayoutsInternal = useRef<{ [key: number]: { sx: number; sy: number } }>({});

  const onDragStart = useCallback((index: number) => {
    if (gridRef.current) {
      gridRef.current.measureInWindow((gx, gy) => {
        gridLayoutInternal.current = { gx, gy };
      });
    }
    const slot = deckSlotRefs.current[index];
    if (slot) {
      slot.measureInWindow((sx, sy) => {
        slotLayoutsInternal.current[index] = { sx, sy };
      });
    }
  }, []);

  const onDragUpdate = useCallback((index: number, tx: number, ty: number) => {
    const gridPos = gridLayoutInternal.current;
    const slotPos = slotLayoutsInternal.current[index];
    
    if (!gridPos || !slotPos || !currentShapes[index]) {
      setPreview(null);
      return;
    }

    const px = slotPos.sx + tx;
    const py = slotPos.sy + ty;

    const rx = px - gridPos.gx - SIZES.CELL_GAP;
    const ry = py - gridPos.gy - SIZES.CELL_GAP;

    const col = Math.round(rx / (CELL_SIZE + SIZES.CELL_GAP));
    const row = Math.round(ry / (CELL_SIZE + SIZES.CELL_GAP));

    const shape = currentShapes[index];
    if (shape && row >= -2 && row < SIZES.GRID_SIZE && col >= -2 && col < SIZES.GRID_SIZE) {
      if (canPlaceShape(shape, row, col, grid)) {
        setPreview({ shapeIndex: index, row, col });
        return;
      }
    }
    setPreview(null);
  }, [currentShapes, grid, canPlaceShape]);

  const onDragEnd = useCallback((index: number, tx: number, ty: number) => {
    setPreview((prev) => {
      if (prev && prev.shapeIndex === index) {
        placeShape(index, prev.row, prev.col);
      }
      return null;
    });
  }, [placeShape]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={[COLORS.background, '#1E293B']}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View>
            <Text style={styles.scoreLabel}>SCORE</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>
          <View style={styles.highScoreContainer}>
            <Text style={styles.highScoreLabel}>BEST: {highScore}</Text>
          </View>
        </View>

        <View 
          ref={gridRef}
          style={styles.gridContainer}
        >
          <Grid 
            gridState={grid} 
            previewShape={preview ? {
              shape: currentShapes[preview.shapeIndex]!,
              row: preview.row,
              col: preview.col
            } : null}
          />
        </View>

        <View style={styles.deck}>
          {currentShapes.map((shape, i) => (
            <View 
              key={`deck-slot-${i}`} 
              ref={(ref) => { deckSlotRefs.current[i] = ref; }}
              style={styles.deckSlot}
            >
              {shape && (
                <DraggableShape
                  index={i}
                  shape={shape}
                  onDragStart={onDragStart}
                  onDragUpdate={onDragUpdate}
                  onDragEnd={onDragEnd}
                />
              )}
            </View>
          ))}
        </View>

        {isGameOver && (
          <Animated.View 
            entering={FadeIn}
            style={styles.overlay}
          >
            <Animated.View 
              entering={ZoomIn}
              style={styles.gameOverCard}
            >
              <Text style={styles.gameOverTitle}>Game Over!</Text>
              <Text style={styles.gameOverScore}>Final Score: {score}</Text>
              <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
                <Text style={styles.restartButtonText}>Restart</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  header: {
    width: GRID_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 20,
  },
  scoreLabel: {
    color: COLORS.text.secondary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
  },
  scoreValue: {
    color: COLORS.text.primary,
    fontSize: 48,
    fontWeight: '900',
  },
  highScoreContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  highScoreLabel: {
    color: COLORS.text.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  gridContainer: {
    padding: 10,
    // Ensure this is stable
  },
  deck: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 120,
    paddingHorizontal: GRID_PADDING,
  },
  deckSlot: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(255,255,255,0.02)', // debug
  },
  deckPositionFixer: {
    position: 'absolute',
    bottom: 40, // Match deck approximate position
    width: '100%',
    height: 120,
    pointerEvents: 'none',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  gameOverCard: {
    width: '80%',
    backgroundColor: COLORS.background,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  gameOverTitle: {
    color: COLORS.text.primary,
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 8,
  },
  gameOverScore: {
    color: COLORS.text.secondary,
    fontSize: 18,
    marginBottom: 24,
  },
  restartButton: {
    backgroundColor: COLORS.blocks[0],
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
  },
  restartButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
  },
});
