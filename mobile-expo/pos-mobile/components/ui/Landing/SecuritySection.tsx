import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Spacing, Typography } from '@/constants/GlobalStyles';
import i18n from '@/config/i18n';
import { Ionicons } from '@expo/vector-icons';

const SecuritySection = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="shield-checkmark-outline" size={48} color={Colors.primary} style={{ alignSelf: 'center' }} />
      <ThemedText style={styles.title}>{i18n.t('Security.title')}</ThemedText>
      <ThemedText style={styles.subtitle}>{i18n.t('Security.subtitle')}</ThemedText>
      <ThemedText style={styles.paragraph}>{i18n.t('Security.p1')}</ThemedText>
      <ThemedText style={styles.paragraph}>{i18n.t('Security.p2')}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.lightGray,
  },
  title: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    textAlign: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  paragraph: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    lineHeight: 22,
    marginBottom: Spacing.md,
    textAlign: 'justify',
  },
});

export default SecuritySection;
