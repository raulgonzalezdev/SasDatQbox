import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Spacing, Typography, BordersAndShadows } from '@/constants/GlobalStyles';
import i18n from '@/config/i18n';

const Testimonials = () => {
  const testimonials = i18n.t('Testimonials.items', { returnObjects: true });

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>{i18n.t('Testimonials.title')}</ThemedText>
      <ThemedText style={styles.subtitle}>{i18n.t('Testimonials.subtitle')}</ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.testimonialsContainer}>
        {testimonials.map((testimonial, index) => (
          <View style={styles.testimonialCard} key={index}>
            <View style={styles.testimonialHeader}>
              <View style={styles.avatar}>
                <ThemedText style={styles.avatarInitial}>{testimonial.initial}</ThemedText>
              </View>
              <View>
                <ThemedText style={styles.name}>{testimonial.name}</ThemedText>
                <ThemedText style={styles.rating}>{'★'.repeat(Math.floor(testimonial.rating))}{testimonial.rating % 1 !== 0 ? '☆' : ''}</ThemedText>
              </View>
            </View>
            <ThemedText style={styles.quote}>"{testimonial.quote}"</ThemedText>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.xxxl,
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
    paddingHorizontal: Spacing.lg,
  },
  testimonialsContainer: {
    paddingLeft: Spacing.lg,
  },
  testimonialCard: {
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.lg,
    marginRight: Spacing.md,
    width: 300,
    ...BordersAndShadows.shadows.md,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarInitial: {
    color: Colors.white,
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
  },
  name: {
    fontWeight: Typography.fontWeights.bold,
  },
  rating: {
    color: Colors.secondary,
  },
  quote: {
    fontSize: Typography.fontSizes.md,
    fontStyle: 'italic',
    color: Colors.darkGray,
  },
});

export default Testimonials;
