import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/Theme';
import Animated, { ZoomIn, ZoomOut, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';

interface BlockProps {
  size: number;
  colorIndex?: number | null;
  isPreview?: boolean;
  previewColorIndex?: number | null;
  style?: any;
}

export const Block: React.FC<BlockProps> = ({ 
  size, 
  colorIndex, 
  isPreview, 
  previewColorIndex,
  style 
  
}) => {
  const color = (colorIndex !== null && colorIndex !== undefined) 
    ? COLORS.blocks[colorIndex] 
    : null;

  const previewColor = isPreview && previewColorIndex !== null && previewColorIndex !== undefined
    ? COLORS.blocks[previewColorIndex]
    : null;

  if (!color && !isPreview) {
    return <View style={[styles.empty, { width: size, height: size }, style]} />;
  }

  return (
    <Animated.View
      entering={!isPreview ? ZoomIn.duration(200) : undefined}
      exiting={!isPreview ? ZoomOut.duration(200) : undefined}
      style={[
        styles.block,
        {
          width: size,
          height: size,
          backgroundColor: color || 'transparent',
          borderWidth: isPreview ? 3 : 0, 
          borderColor: previewColor || 'transparent',
          borderRadius: size * 0.15,
        },
        !isPreview && color && styles.shadow,
        style,
      ]}
    >
      <View style={[styles.inner, { 
        borderRadius: size * 0.1, 
        backgroundColor: color ? 'rgba(255, 255, 255, 0.1)' : 'transparent' 
      }]}>
        {!isPreview && color && <View style={styles.highlight} />}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  empty: {
    backgroundColor: COLORS.gridBackground,
    borderRadius: SIZES.BLOCK_RADIUS,
    borderWidth: 1,
    borderColor: COLORS.gridLine,
  },
  block: {
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    width: '35%',
    height: '25%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 4,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },
});
