import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import { COLORS } from '../constants/Theme';

interface SlidingTileProps {
  number: number;
  currentIndex: number;
  onPress: () => void;
  size: number;
  imageUri: string | null;
}

const GRID_SIZE = 4;

export const SlidingTile: React.FC<SlidingTileProps> = ({ 
  number, 
  currentIndex, 
  onPress, 
  size, 
  imageUri 
}) => {
  if (number === 0) return null; 

  const targetX = (currentIndex % GRID_SIZE) * size;
  const targetY = Math.floor(currentIndex / GRID_SIZE) * size;

  const translateX = useSharedValue(targetX);
  const translateY = useSharedValue(targetY);

  useEffect(() => {
    translateX.value = withSpring(targetX, { damping: 20, stiffness: 200 });
    translateY.value = withSpring(targetY, { damping: 20, stiffness: 200 });
  }, [currentIndex]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });


  const originalRow = Math.floor((number - 1) / GRID_SIZE);
  const originalCol = (number - 1) % GRID_SIZE;

  return (
    <Animated.View style={[styles.tile, { width: size, height: size }, animatedStyle]}>
      <TouchableOpacity 
        onPress={onPress} 
        activeOpacity={0.8} 
        style={styles.touchable}
      >
        <View style={styles.imageContainer}>
          {imageUri && (
            <Image 
              source={{ uri: imageUri }} 
              style={[
                styles.image, 
                { 
                  width: size * GRID_SIZE, 
                  height: size * GRID_SIZE,
                  marginLeft: -originalCol * size,
                  marginTop: -originalRow * size,
                }
              ]} 
              resizeMode="cover"
            />
          )}
          {imageUri ? (
            <View style={styles.numberBadge}>
              <Text style={styles.numberBadgeText}>{number}</Text>
            </View>
          ) : (
            <View style={styles.numberContainer}>
              <Text style={styles.numberText}>{number}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tile: {
    position: 'absolute',
    padding: 2,
  },
  touchable: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  image: {
    position: 'absolute',
  },
  numberContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  numberBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 5,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  numberText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },
  numberBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
});
