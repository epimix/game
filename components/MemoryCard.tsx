import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, useSharedValue, interpolate, Extrapolate } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/Theme';

interface MemoryCardProps {
  pairId: string | number;
  imageUri: string | null;
  isFlipped: boolean;
  isMatched: boolean;
  onPress: () => void;
  size: number;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ 
  pairId, 
  imageUri, 
  isFlipped, 
  isMatched, 
  onPress,
  size
}) => {
  const rotateValue = useSharedValue(0);

  useEffect(() => {
    rotateValue.value = withTiming(isFlipped || isMatched ? 180 : 0, { duration: 400 });
  }, [isFlipped, isMatched]);

  const frontStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotateValue.value, [0, 180], [180, 0]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
    };
  });

  const backStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotateValue.value, [0, 180], [0, 180]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
    };
  });

  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={onPress} 
      disabled={isFlipped || isMatched}
      style={{ width: size, height: size * 1.3, margin: 4 }}
    >
      
      <Animated.View style={[styles.card, styles.cardFront, frontStyle]}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
        ) : (
          <Ionicons name={pairId as any} size={size * 0.6} color={COLORS.text.primary} />
        )}
      </Animated.View>

      
      <Animated.View style={[styles.card, styles.cardBack, backStyle]}>
        <Ionicons name="help-buoy-outline" size={size * 0.6} color={COLORS.text.secondary} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardFront: {
    backgroundColor: '#1E293B',
    overflow: 'hidden',
  },
  cardBack: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
