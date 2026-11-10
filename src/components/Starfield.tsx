import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';

const STAR_COUNT = 70;

function createStars() {
  let seed = 7;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  return Array.from({ length: STAR_COUNT }, (_, index) => {
    const size = random() > 0.85 ? 2 : 1;
    return {
      key: index,
      left: `${random() * 100}%` as const,
      top: `${random() * 100}%` as const,
      size,
      opacity: 0.2 + random() * 0.5,
    };
  });
}

const STARS = createStars();

function StarfieldComponent() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {STARS.map((star) => (
        <View
          key={star.key}
          style={[
            styles.star,
            {
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
}

export const Starfield = memo(StarfieldComponent);

const styles = StyleSheet.create({
  star: {
    position: 'absolute',
    borderRadius: 1,
    backgroundColor: colors.star,
  },
});
