import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Spacing, Typography } from '@/constants/GlobalStyles';
import i18n from '@/config/i18n';

const AboutSection = () => {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>{i18n.t('About.missionTitle')}</ThemedText>
      <ThemedText style={styles.subtitle}>{i18n.t('About.missionSubtitle')}</ThemedText>

      <View style={styles.contentBlock}>
        <ThemedText style={styles.blockTitle}>{i18n.t('About.aboutBoxDoctorTitle')}</ThemedText>
        <ThemedText style={styles.paragraph}>{i18n.t('About.aboutBoxDoctorP1')}</ThemedText>
      </View>

      <View style={styles.contentBlock}>
        <ThemedText style={styles.blockTitle}>{i18n.t('About.ourTeamTitle')}</ThemedText>
        <ThemedText style={styles.paragraph}>{i18n.t('About.ourTeamP1')}</ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: Typography.fontSizes.xxl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  contentBlock: {
    marginBottom: Spacing.lg,
  },
  blockTitle: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.dark,
    marginBottom: Spacing.md,
  },
  paragraph: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    lineHeight: 22,
  },
});

export default AboutSection;
