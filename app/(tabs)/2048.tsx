import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../../constants/Theme';
import { use2048Logic } from '../../hooks/use2048Logic';
import { Grid2048 } from '../../components/Grid2048';
import { Tile2048 } from '../../components/Tile2048';

const { width } = Dimensions.get('window');

export default function Game2048Screen() {
  const { tiles, score, bestScore, gameOver, move, reset } = use2048Logic();

  const panGesture = Gesture.Pan()
    .onBegin(() => {})
    .onEnd((event) => {
      const { translationX, translationY } = event;
      const absX = Math.abs(translationX);
      const absY = Math.abs(translationY);

      if (Math.max(absX, absY) < 20) return;

      if (absX > absY) {
        if (translationX > 0) move('RIGHT');
        else move('LEFT');
      } else {
        if (translationY > 0) move('DOWN');
        else move('UP');
      }
    })
    .runOnJS(true);

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[COLORS.background, '#1E293B']}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>2048</Text>
            <TouchableOpacity style={styles.resetButton} onPress={reset}>
               <Ionicons name="refresh" size={24} color={COLORS.text.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.scoreContainer}>
             <View style={styles.scoreBox}>
                <Text style={styles.scoreLabel}>SCORE</Text>
                <Text style={styles.scoreValue}>{score}</Text>
             </View>
             <View style={styles.scoreBox}>
                <Text style={styles.scoreLabel}>BEST</Text>
                <Text style={styles.scoreValue}>{bestScore}</Text>
             </View>
          </View>
        </View>

        <GestureDetector gesture={panGesture}>
          <View style={styles.gameView}>
            <Grid2048 />
            {tiles.map((tile) => (
               <Tile2048 
                key={tile.id} 
                value={tile.value}
                row={tile.row}
                col={tile.col}
               />
            ))}
          </View>
        </GestureDetector>

       

        {gameOver && (
          <Animated.View entering={FadeIn} style={styles.overlay}>
            <Animated.View entering={ZoomIn} style={styles.gameOverCard}>
              <Text style={styles.gameOverTitle}>Game Over!</Text>
              <Text style={styles.gameOverScore}>Final Score: {score}</Text>
              <TouchableOpacity style={styles.restartButton} onPress={reset}>
                <Text style={styles.restartButtonText}>Try Again</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    color: COLORS.text.primary,
    fontSize: 48,
    fontWeight: '900',
  },
  scoreContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  scoreBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  scoreLabel: {
    color: COLORS.text.secondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  scoreValue: {
    color: COLORS.text.primary,
    fontSize: 20,
    fontWeight: '800',
  },
  resetButton: {
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameView: {
    alignSelf: 'center',
    position: 'relative',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.text.secondary,
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
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
    backgroundColor: COLORS.tile2048['2048'],
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
