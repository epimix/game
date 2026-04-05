import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.background, '#1E293B']}
        style={StyleSheet.absoluteFill}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <Animated.View 
          entering={FadeInUp.duration(800)}
          style={styles.content}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="game-controller" size={80} color={COLORS.blocks[0]} />
          </View>
          
          <Text style={styles.title}>GameHub</Text>
          <Text style={styles.subtitle}>Welcome</Text>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Featured Game</Text>
            
            <Link href="/game" asChild>
              <TouchableOpacity style={styles.playButton}>
                <Ionicons name="play" size={24} color="#000" />
                <Text style={styles.playButtonText}>Play Now</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </Animated.View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '85%',
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    color: COLORS.text.primary,
    fontSize: 42,
    fontWeight: '900',
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.text.secondary,
    fontSize: 18,
    marginBottom: 48,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  cardTitle: {
    color: COLORS.blocks[0],
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  cardDesc: {
    color: COLORS.text.primary,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  playButton: {
    backgroundColor: COLORS.blocks[0],
    flexDirection: 'row',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  playButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
  },
});
