import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { ShapeDefinition } from '../constants/Shapes';
import { Block } from './Block';
import { CELL_SIZE } from './Grid';
import { SIZES } from '../constants/Theme';

interface DraggableShapeProps {
  shape: ShapeDefinition;
  index: number;
  onDragStart: (index: number) => void;
  onDragUpdate: (index: number, x: number, y: number) => void;
  onDragEnd: (index: number, x: number, y: number) => void;
}

export const DraggableShape: React.FC<DraggableShapeProps> = ({
  shape,
  index,
  onDragStart,
  onDragUpdate,
  onDragEnd,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0.6); 
  const isDragging = useSharedValue(false);

  const context = useSharedValue({ x: 0, y: 0 });

  const gesture = Gesture.Pan()
    .onStart(() => {
      runOnJS(onDragStart)(index);
      context.value = { x: translateX.value, y: translateY.value };
      scale.value = withSpring(1.0); 
      isDragging.value = true;
    })
    .onUpdate((event) => {
      translateX.value = context.value.x + event.translationX;
      translateY.value = context.value.y + event.translationY - 100;
      runOnJS(onDragUpdate)(index, translateX.value, translateY.value);
    })
    .onEnd(() => {
      isDragging.value = false;
      runOnJS(onDragEnd)(index, translateX.value, translateY.value);
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      scale.value = withSpring(0.6);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    zIndex: isDragging.value ? 1000 : 1,
  }));

  const maxX = Math.max(...shape.points.map(p => p[0]));
  const maxY = Math.max(...shape.points.map(p => p[1]));
  const width = (maxX + 1) * CELL_SIZE + maxX * SIZES.CELL_GAP;
  const height = (maxY + 1) * CELL_SIZE + maxY * SIZES.CELL_GAP;

  return (
    <View style={styles.wrapper}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.container, animatedStyle, { width, height }]}>
          {shape.points.map(([dx, dy], i) => (
            <Block
              key={`shape-block-${i}`}
              size={CELL_SIZE}
              colorIndex={shape.colorIndex}
              style={{
                position: 'absolute',
                left: dx * (CELL_SIZE + SIZES.CELL_GAP),
                top: dy * (CELL_SIZE + SIZES.CELL_GAP),
              }}
            />
          ))}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    position: 'relative',
  },
});
