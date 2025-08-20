import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import i18n from '@/config/i18n';
import { Colors, Spacing, Typography, BordersAndShadows } from '@/constants/GlobalStyles';

const Header = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const changeLanguage = (lang) => {
    i18n.locale = lang;
    setModalVisible(false);
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  return (
    <View style={styles.headerContainer}>
      <Image source={require('@/assets/images/logo-doctorbox.png')} style={styles.logo} />

      <View style={styles.rightContainer}>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.iconButton}>
          <Ionicons name="language-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogin} style={styles.iconButton}>
          <Ionicons name="log-in-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.iconButton}>
          <Ionicons name="menu-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Select Language</Text>
            <TouchableOpacity style={styles.languageButton} onPress={() => changeLanguage('en')}>
              <Text style={styles.languageButtonText}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.languageButton} onPress={() => changeLanguage('es')}>
              <Text style={styles.languageButtonText}>Español</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/#features'); }}>
              <Text style={styles.menuItemText}>{i18n.t('Navbar.features')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/#pricing'); }}>
              <Text style={styles.menuItemText}>{i18n.t('Navbar.pricing')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/#blog'); }}>
              <Text style={styles.menuItemText}>{i18n.t('Navbar.blog')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/#help'); }}>
              <Text style={styles.menuItemText}>{i18n.t('Navbar.help')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setMenuVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconButton: {
    padding: Spacing.sm,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: Spacing.lg,
    backgroundColor: 'white',
    borderRadius: BordersAndShadows.borderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    ...BordersAndShadows.shadows.md,
  },
  modalText: {
    marginBottom: Spacing.lg,
    textAlign: 'center',
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
  },
  languageButton: {
    backgroundColor: Colors.primary,
    borderRadius: BordersAndShadows.borderRadius.md,
    padding: Spacing.md,
    elevation: 2,
    marginBottom: Spacing.md,
    width: 200,
    alignItems: 'center',
  },
  languageButtonText: {
    color: 'white',
    fontWeight: Typography.fontWeights.bold,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: Colors.secondary,
    borderRadius: BordersAndShadows.borderRadius.md,
    padding: Spacing.md,
    elevation: 2,
    marginTop: Spacing.lg,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: Typography.fontWeights.bold,
    textAlign: 'center',
  },
  menuItem: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    width: '100%',
  },
  menuItemText: {
    fontSize: Typography.fontSizes.md,
    textAlign: 'center',
  },
});

export default Header;