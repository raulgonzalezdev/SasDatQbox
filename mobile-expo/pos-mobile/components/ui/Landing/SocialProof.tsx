import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Spacing, Typography } from '@/constants/GlobalStyles';
import i18n from '@/config/i18n';

const SocialProof = () => {
  const stats = i18n.t('SocialProof.stats', { returnObjects: true });

  return (
    <View style={styles.container}>
      <ThemedText style={styles.trustedBy}>{i18n.t('LogoCloud.trustedBy')}</ThemedText>
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View style={styles.statItem} key={index}>
            <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
            <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightGray,
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  trustedBy: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    marginVertical: Spacing.md,
    minWidth: 150,
  },
  statValue: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primary,
  },
  statLabel: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.darkGray,
    marginTop: Spacing.xs,
  },
});

export default SocialProof;
