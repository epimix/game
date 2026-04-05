import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';

import { COLORS } from '../../constants/Theme';
import { useSlidingLogic } from '../../hooks/useSlidingLogic';
import { SlidingTile } from '../../components/SlidingTile';

const { width } = Dimensions.get('window');
const GRID_PADDING = 20;
const PUZZLE_SIZE = width - GRID_PADDING * 2;
const TILE_SIZE = PUZZLE_SIZE / 4;

export default function SlidingPuzzleScreen() {
  const [puzzleImage, setPuzzleImage] = useState<string | null>(null);
  const { tiles, moves, isWon, handleMove, moveByDirection, reset } = useSlidingLogic();

  const panGesture = Gesture.Pan()
    .onEnd((event) => {
      const { translationX, translationY } = event;
      const absX = Math.abs(translationX);
      const absY = Math.abs(translationY);

      if (Math.max(absX, absY) < 20) return;

      if (absX > absY) {
        if (translationX > 0) moveByDirection('RIGHT');
        else moveByDirection('LEFT');
      } else {
        if (translationY > 0) moveByDirection('DOWN');
        else moveByDirection('UP');
      }
    })
    .runOnJS(true);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need gallery access to use your photos!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPuzzleImage(result.assets[0].uri);
      reset();
    }
  };

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
            <Text style={styles.title}>Puzzle</Text>
            <Text style={styles.subtitle}>Sliding Pieces</Text>
          </View>
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <Ionicons name="image" size={24} color="#000" />
            <Text style={styles.imageButtonText}>Choose</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>MOVES</Text>
            <Text style={styles.statValue}>{moves}</Text>
          </View>
          <TouchableOpacity style={styles.resetButton} onPress={reset}>
            <Ionicons name="refresh" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.puzzleContainer}>
          <GestureDetector gesture={panGesture}>
            <View style={[styles.grid, { width: PUZZLE_SIZE, height: PUZZLE_SIZE }]}>
              {tiles.map((num, i) => (
                <SlidingTile
                  key={`tile-${num}-${i}`}
                  number={num}
                  currentIndex={i}
                  onPress={() => handleMove(i)}
                  size={TILE_SIZE}
                  imageUri={puzzleImage}
                />
              ))}
            </View>
          </GestureDetector>
        </View>

        <View style={styles.footer}>
             <Text style={styles.footerText}>Tap or swipe tiles adjacent to the empty spot</Text>
        </View>

        {isWon && (
          <Animated.View entering={FadeIn} style={styles.overlay}>
            <Animated.View entering={ZoomIn} style={styles.winCard}>
              <Ionicons name="star" size={80} color={COLORS.text.accent} />
              <Text style={styles.winTitle}>Congratulations!</Text>
              <Text style={styles.winScore}>Solved in {moves} moves</Text>
              <TouchableOpacity style={styles.restartButton} onPress={reset}>
                <Text style={styles.restartButtonText}>Play Again</Text>
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
    paddingHorizontal: GRID_PADDING,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 32,
  },
  title: {
    color: COLORS.text.primary,
    fontSize: 32,
    fontWeight: '900',
  },
  subtitle: {
    color: COLORS.text.secondary,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  imageButton: {
    backgroundColor: COLORS.blocks[3], 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  imageButtonText: {
    color: '#000',
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  statLabel: {
    color: COLORS.text.secondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  statValue: {
    color: COLORS.text.primary,
    fontSize: 20,
    fontWeight: '900',
  },
  resetButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  puzzleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    color: COLORS.text.secondary,
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  winCard: {
    width: '85%',
    backgroundColor: COLORS.background,
    borderRadius: 32,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  winTitle: {
    color: COLORS.text.primary,
    fontSize: 30,
    fontWeight: '900',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  winScore: {
    color: COLORS.text.secondary,
    fontSize: 18,
    marginBottom: 32,
  },
  restartButton: {
    backgroundColor: COLORS.blocks[3],
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  restartButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '800',
  },
});
