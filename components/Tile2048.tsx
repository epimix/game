import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, withSequence, useSharedValue, Easing } from 'react-native-reanimated';
import { COLORS } from '../constants/Theme';
import { PADDING, GAP, TILE_SIZE } from './Grid2048';

interface TileProps {
  value: number;
  row: number;
  col: number;
}

export const Tile2048: React.FC<TileProps> = ({ value, row, col }) => {
  const scale = useSharedValue(0.1);
  const x = PADDING + col * (TILE_SIZE + GAP);
  const y = PADDING + row * (TILE_SIZE + GAP);
  
  const translateX = useSharedValue(x);
  const translateY = useSharedValue(y);

  useEffect(() => {
    translateX.value = withTiming(x, { duration: 100, easing: Easing.out(Easing.quad) });
    translateY.value = withTiming(y, { duration: 100, easing: Easing.out(Easing.quad) });
  }, [row, col]);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 100, easing: Easing.out(Easing.back(1)) });
  }, []);

  useEffect(() => {
    if (value > 0) {
      scale.value = withSequence(
        withTiming(1.1, { duration: 50 }),
        withTiming(1, { duration: 50 })
      );
    }
  }, [value]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  const getTileColor = (val: number) => {
    const colorKey = val.toString() as keyof typeof COLORS.tile2048;
    return COLORS.tile2048[colorKey] || COLORS.tile2048['2048'];
  };

  const getTextColor = (val: number) => {
    return val <= 4 ? '#1E293B' : '#FFFFFF';
  };

  const getFontSize = (val: number) => {
    if (val >= 1024) return 20;
    if (val >= 128) return 24;
    return 32;
  };

  return (
    <Animated.View style={[styles.tile, { backgroundColor: getTileColor(value) }, animatedStyle]}>
      <Text style={[styles.tileText, { color: getTextColor(value), fontSize: getFontSize(value) }]}>
        {value}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tile: {
    position: 'absolute',
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tileText: {
    fontWeight: '900',
  },
});
