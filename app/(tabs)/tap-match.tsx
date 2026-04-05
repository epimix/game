import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

import { COLORS } from '../../constants/Theme';
import { useMemoryLogic } from '../../hooks/useMemoryLogic';
import { MemoryCard } from '../../components/MemoryCard';

const { width } = Dimensions.get('window');
const GRID_PADDING = 20;
const CARD_SIZE = (width - GRID_PADDING * 2 - 40) / 4;

const INITIAL_PHOTOS = [
  'https://i.pinimg.com/736x/5a/f2/22/5af2224e3799801836d5c0768ad82ea1.jpg',
  'https://i.pinimg.com/736x/cc/42/e0/cc42e0e37205e4f1e07aa40232f6834a.jpg',
  'https://i.pinimg.com/736x/42/53/4a/42534a018f09d094514dc1db4553e9b6.jpg',
  'https://i.pinimg.com/736x/49/74/71/497471ff270048dd1f0fd350607f8005.jpg',
  'https://i.pinimg.com/736x/c8/48/e5/c848e5037d9652dc6d851cf7be991e1f.jpg',
  'https://i.pinimg.com/736x/cb/37/f4/cb37f4ef9006e4c4ce2ea199313a05ea.jpg',
  'https://i.pinimg.com/736x/11/5d/f5/115df5c7f2ce494ebce3d5639ef2b893.jpg',
  'https://i.pinimg.com/1200x/c1/13/bd/c113bde12e2d291668d4b8a503cd402a.jpg',
];

export default function TapMatchScreen() {
  const [customPhotos] = useState<string[]>(INITIAL_PHOTOS);
  const { cards, moves, matches, isWon, handleFlip, reset } = useMemoryLogic(customPhotos);

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
            <Text style={styles.title}>Tap Match</Text>
            <Text style={styles.subtitle}>Memory Challenge</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>MOVES</Text>
            <Text style={styles.statValue}>{moves}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>MATCHES</Text>
            <Text style={styles.statValue}>{matches}/8</Text>
          </View>
          <TouchableOpacity style={styles.resetButton} onPress={reset}>
            <Ionicons name="refresh" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.gridContainer}>
          <View style={styles.grid}>
            {cards.map((card, index) => (
              <MemoryCard
                key={card.id}
                pairId={card.pairId}
                imageUri={card.imageUri}
                isFlipped={card.isFlipped}
                isMatched={card.isMatched}
                onPress={() => handleFlip(index)}
                size={CARD_SIZE}
              />
            ))}
          </View>
        </View>

        {isWon && (
          <Animated.View entering={FadeIn} style={styles.overlay}>
            <Animated.View entering={ZoomIn} style={styles.winCard}>
              <Ionicons name="trophy" size={80} color={COLORS.text.accent} />
              <Text style={styles.winTitle}>Well Done!</Text>
              <Text style={styles.winScore}>Finished in {moves} moves</Text>
              <TouchableOpacity style={styles.restartButton} onPress={reset}>
                <Text style={styles.restartButtonText}>Play Again</Text>
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
  gridContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 32,
    fontWeight: '900',
    marginTop: 16,
    marginBottom: 8,
  },
  winScore: {
    color: COLORS.text.secondary,
    fontSize: 18,
    marginBottom: 32,
  },
  restartButton: {
    backgroundColor: COLORS.blocks[0],
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
