import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { CustomStatusBar } from '@/components/ui/CustomStatusBar';
import { Colors, CommonStyles, Spacing, BordersAndShadows, Typography } from '@/constants/GlobalStyles';
import { useAppStore } from '@/store/appStore';
import i18n from '@/config/i18n';

// Import new sections
import SocialProof from '@/components/ui/Landing/SocialProof';
import Testimonials from '@/components/ui/Landing/Testimonials';
import FAQ from '@/components/ui/Landing/FAQ';
import AboutSection from '@/components/ui/Landing/AboutSection';
import SecuritySection from '@/components/ui/Landing/SecuritySection';

export default function LandingPage() {
  const { hidePromotions } = useAppStore();
  const [hidePromos] = useState(hidePromotions);

  const plans = i18n.t('Pricing.plans', { returnObjects: true }) || [];
  const features = i18n.t('Features.items', { returnObjects: true }) || [];

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleDownloadApp = () => {
    Alert.alert(
      i18n.t('Navbar.downloadApp'),
      'La app ya está disponible en tu dispositivo. Si necesitas la versión web, visita boxdoctor.com',
      [{ text: 'Entendido' }]
    );
  };

  return (
    <SafeAreaView style={CommonStyles.safeArea}>
      <CustomStatusBar backgroundColor={Colors.primary} barStyle="dark-content" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <ThemedText style={styles.logo}>BoxDoctor</ThemedText>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <ThemedText style={styles.loginButtonText}>{i18n.t('Navbar.login')}</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <ThemedText style={styles.heroTitle}>{i18n.t('Hero.title')}</ThemedText>
          <ThemedText style={styles.heroSubtitle}>{i18n.t('Hero.subtitle')}</ThemedText>
          <View style={styles.heroButtons}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/auth/register')}>
              <ThemedText style={styles.primaryButtonText}>{i18n.t('Hero.cta')}</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleDownloadApp}>
              <Ionicons name="download-outline" size={20} color={Colors.secondary} />
              <ThemedText style={styles.secondaryButtonText}>{i18n.t('Navbar.downloadApp')}</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <ThemedText style={styles.sectionTitle}>{i18n.t('Features.title')}</ThemedText>
          <ThemedText style={styles.sectionSubtitle}>{i18n.t('Features.subtitle')}</ThemedText>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View style={styles.featureCard} key={index}>
                <View style={styles.featureIcon}>
                  <Ionicons name="checkmark-circle-outline" size={32} color={Colors.primary} />
                </View>
                <ThemedText style={styles.featureTitle}>{feature.title}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Social Proof */}
        <SocialProof />

        {/* Testimonials */}
        <Testimonials />

        {/* Pricing Section */}
        {!hidePromos && (
          <View style={styles.pricingSection}>
            <ThemedText style={styles.sectionTitle}>{i18n.t('Pricing.title')}</ThemedText>
            <ThemedText style={styles.sectionSubtitle}>{i18n.t('Pricing.subtitle')}</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.plansContainer}>
              {plans.map((plan, index) => (
                <View key={index} style={[styles.planCard, plan.isPopular && styles.recommendedPlan]}>
                  {plan.isPopular && (
                    <View style={styles.recommendedBadge}>
                      <ThemedText style={styles.recommendedText}>{i18n.t('Pricing.mostPopular')}</ThemedText>
                    </View>
                  )}
                  <ThemedText style={styles.planName}>{plan.name}</ThemedText>
                  <View style={styles.planPrice}>
                    <ThemedText style={styles.planPriceAmount}>{typeof plan.price === 'number' ? `$${plan.price}` : plan.price}</ThemedText>
                    {typeof plan.price === 'number' && <ThemedText style={styles.planPricePeriod}>/{i18n.t('Pricing.perMonth')}</ThemedText>}
                  </View>
                  <View style={styles.planFeatures}>
                    {plan.description.split('. ').map((feature, fIndex) => (
                      <View key={fIndex} style={styles.planFeature}>
                        <Ionicons name="checkmark-outline" size={16} color={Colors.success} />
                        <ThemedText style={styles.planFeatureText}>{feature}</ThemedText>
                      </View>
                    ))}
                  </View>
                  <TouchableOpacity
                    style={[styles.planButton, { backgroundColor: Colors.primary }]}
                    onPress={() => router.push('/auth/register')}
                  >
                    <ThemedText style={styles.planButtonText}>{plan.buttonText}</ThemedText>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* FAQ */}
        <FAQ />

        {/* About Section */}
        <AboutSection />

        {/* Security Section */}
        <SecuritySection />

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <ThemedText style={styles.footerLogo}>BoxDoctor</ThemedText>
            <View style={styles.footerLinks}>
              <TouchableOpacity onPress={() => router.push('/about')}><ThemedText style={styles.footerLink}>{i18n.t('Footer.about')}</ThemedText></TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/help')}><ThemedText style={styles.footerLink}>{i18n.t('Footer.help')}</ThemedText></TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/settings')}><ThemedText style={styles.footerLink}>{i18n.t('Footer.legal')}</ThemedText></TouchableOpacity>
            </View>
            <ThemedText style={styles.footerCopyright}>© {new Date().getFullYear()} BoxDoctor. {i18n.t('Footer.rights')}</ThemedText>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, backgroundColor: Colors.white },
  logoContainer: { flex: 1 },
  logo: { fontSize: Typography.fontSizes.title, fontWeight: Typography.fontWeights.bold, color: Colors.primary },
  headerButtons: { flexDirection: 'row', alignItems: 'center' },
  loginButton: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BordersAndShadows.borderRadius.md, backgroundColor: Colors.primary },
  loginButtonText: { color: Colors.white, fontWeight: Typography.fontWeights.medium },
  heroSection: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.xxxl, backgroundColor: Colors.lightGray, alignItems: 'center' },
  heroTitle: { fontSize: Typography.fontSizes.xxxl, fontWeight: Typography.fontWeights.bold, color: Colors.dark, textAlign: 'center', marginBottom: Spacing.md },
  heroSubtitle: { fontSize: Typography.fontSizes.lg, color: Colors.darkGray, textAlign: 'center', marginBottom: Spacing.xl, lineHeight: 24 },
  heroButtons: { flexDirection: 'row', gap: Spacing.md },
  primaryButton: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: BordersAndShadows.borderRadius.lg, flexDirection: 'row', alignItems: 'center' },
  primaryButtonText: { color: Colors.white, fontWeight: Typography.fontWeights.bold, fontSize: Typography.fontSizes.md },
  secondaryButton: { backgroundColor: Colors.white, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: BordersAndShadows.borderRadius.lg, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, borderWidth: 1, borderColor: Colors.primary },
  secondaryButtonText: { color: Colors.primary, fontWeight: Typography.fontWeights.medium, fontSize: Typography.fontSizes.md },
  featuresSection: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.xxxl },
  sectionTitle: { fontSize: Typography.fontSizes.xxl, fontWeight: Typography.fontWeights.bold, color: Colors.dark, textAlign: 'center', marginBottom: Spacing.sm },
  sectionSubtitle: { fontSize: Typography.fontSizes.md, color: Colors.darkGray, textAlign: 'center', marginBottom: Spacing.xl, paddingHorizontal: Spacing.lg },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: Spacing.lg },
  featureCard: { width: '48%', backgroundColor: Colors.white, padding: Spacing.lg, borderRadius: BordersAndShadows.borderRadius.lg, alignItems: 'center', ...BordersAndShadows.shadows.md },
  featureIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.lightGray, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md },
  featureTitle: { fontSize: Typography.fontSizes.md, fontWeight: Typography.fontWeights.bold, color: Colors.dark, textAlign: 'center' },
  pricingSection: { paddingVertical: Spacing.xxxl, backgroundColor: Colors.lightGray },
  plansContainer: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg },
  planCard: { width: 280, backgroundColor: Colors.white, marginRight: Spacing.lg, padding: Spacing.lg, borderRadius: BordersAndShadows.borderRadius.lg, ...BordersAndShadows.shadows.md, position: 'relative' },
  recommendedPlan: { borderColor: Colors.primary, borderWidth: 2 },
  recommendedBadge: { position: 'absolute', top: -15, alignSelf: 'center', backgroundColor: Colors.primary, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BordersAndShadows.borderRadius.circle },
  recommendedText: { color: Colors.white, fontSize: Typography.fontSizes.xs, fontWeight: Typography.fontWeights.bold },
  planName: { fontSize: Typography.fontSizes.lg, fontWeight: Typography.fontWeights.bold, color: Colors.dark, textAlign: 'center', marginVertical: Spacing.sm },
  planPrice: { flexDirection: 'row', justifyContent: 'center', alignItems: 'baseline', marginBottom: Spacing.lg },
  planPriceAmount: { fontSize: Typography.fontSizes.xxxl, fontWeight: Typography.fontWeights.bold, color: Colors.primary },
  planPricePeriod: { fontSize: Typography.fontSizes.md, color: Colors.darkGray, marginLeft: Spacing.xs },
  planFeatures: { marginBottom: Spacing.xl, paddingHorizontal: Spacing.sm },
  planFeature: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  planFeatureText: { fontSize: Typography.fontSizes.sm, color: Colors.dark, marginLeft: Spacing.sm, flex: 1 },
  planButton: { paddingVertical: Spacing.md, borderRadius: BordersAndShadows.borderRadius.md, alignItems: 'center', marginTop: 'auto' },
  planButtonText: { color: Colors.white, fontWeight: Typography.fontWeights.bold, fontSize: Typography.fontSizes.md },
  footer: { backgroundColor: Colors.dark, paddingVertical: Spacing.xl, paddingHorizontal: Spacing.lg },
  footerContent: { alignItems: 'center' },
  footerLogo: { fontSize: Typography.fontSizes.xxl, fontWeight: Typography.fontWeights.bold, color: Colors.white, marginBottom: Spacing.sm },
  footerLinks: { flexDirection: 'row', gap: Spacing.xl, marginVertical: Spacing.lg },
  footerLink: { color: Colors.white, fontSize: Typography.fontSizes.md },
  footerCopyright: { color: Colors.darkGray, fontSize: Typography.fontSizes.sm, textAlign: 'center' },
});
