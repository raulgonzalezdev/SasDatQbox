import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Spacing, Typography, BordersAndShadows } from '@/constants/GlobalStyles';
import i18n from '@/config/i18n';
import { Ionicons } from '@expo/vector-icons';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.faqItem}>
      <TouchableOpacity style={styles.questionContainer} onPress={() => setIsOpen(!isOpen)}>
        <ThemedText style={styles.questionText}>{question}</ThemedText>
        <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={24} color={Colors.darkGray} />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.answerContainer}>
          <ThemedText style={styles.answerText}>{answer}</ThemedText>
        </View>
      )}
    </View>
  );
};

const FAQ = () => {
  const faqs = i18n.t('FAQ.questions', { returnObjects: true });

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>{i18n.t('FAQ.title')}</ThemedText>
      <View style={styles.faqList}>
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </View>
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
    marginBottom: Spacing.xl,
  },
  faqList: {},
  faqItem: {
    backgroundColor: Colors.white,
    borderRadius: BordersAndShadows.borderRadius.md,
    marginBottom: Spacing.md,
    padding: Spacing.lg,
    ...BordersAndShadows.shadows.sm,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionText: {
    flex: 1,
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.medium,
    marginRight: Spacing.md,
  },
  answerContainer: {
    marginTop: Spacing.md,
  },
  answerText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.darkGray,
    lineHeight: 22,
  },
});

export default FAQ;
