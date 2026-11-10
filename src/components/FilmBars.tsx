import { StyleSheet, View } from 'react-native';

import { colors, TOTAL_FILMS } from '@/constants/theme';

interface FilmBarsProps {
  count: number;
  size?: 'small' | 'large';
}

export function FilmBars({ count, size = 'small' }: FilmBarsProps) {
  const lit = Math.min(count, TOTAL_FILMS);
  const barStyle = size === 'large' ? styles.barLarge : styles.barSmall;

  return (
    <View style={styles.row} accessible accessibilityLabel={`Appears in ${count} of ${TOTAL_FILMS} films`}>
      {Array.from({ length: TOTAL_FILMS }, (_, index) => (
        <View key={index} style={[barStyle, { backgroundColor: index < lit ? colors.crawl : colors.unlit }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  barSmall: {
    width: 3,
    height: 14,
    borderRadius: 1,
  },
  barLarge: {
    width: 5,
    height: 20,
    borderRadius: 1,
  },
});
