import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import i18n from '@/config/i18n';
import { Colors, Spacing, Typography, BordersAndShadows } from '@/constants/GlobalStyles';
import { useAppStore } from '@/store/appStore';

const Header = () => {
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const { currentLocale, setLocale } = useAppStore();

  const changeLanguage = (lang) => {
    setLocale(lang);
    setLanguageModalVisible(false);
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  return (
    <View style={styles.headerContainer}>
      <Image source={require('@/assets/images/logo-doctorbox.png')} style={styles.logo} />

      <View style={styles.rightContainer}>
        <TouchableOpacity onPress={() => setLanguageModalVisible(true)} style={styles.iconButton}>
          <Ionicons name="globe-outline" size={24} color={Colors.primary} />
          <Text style={styles.languageText}>{currentLocale.toUpperCase()}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogin} style={styles.iconButton}>
          <Ionicons name="log-in-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMenuModalVisible(true)} style={styles.iconButton}>
          <Ionicons name="menu-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Language Dropdown */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setLanguageModalVisible(false)}>
          <View style={[styles.dropdown, styles.languageDropdown]}>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => changeLanguage('en')}>
              <Text style={styles.dropdownItemText}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => changeLanguage('es')}>
              <Text style={styles.dropdownItemText}>Español</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Menu Dropdown */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuModalVisible}
        onRequestClose={() => setMenuModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setMenuModalVisible(false)}>
          <View style={[styles.dropdown, styles.menuDropdown]}>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => { setMenuModalVisible(false); router.push('/#features'); }}>
              <Text style={styles.dropdownItemText}>{i18n.t('Navbar.features')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => { setMenuModalVisible(false); router.push('/#pricing'); }}>
              <Text style={styles.dropdownItemText}>{i18n.t('Navbar.pricing')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => { setMenuModalVisible(false); router.push('/#blog'); }}>
              <Text style={styles.dropdownItemText}>{i18n.t('Navbar.blog')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => { setMenuModalVisible(false); router.push('/#help'); }}>
              <Text style={styles.dropdownItemText}>{i18n.t('Navbar.help')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
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
    width: 150,
    height: 50,
    resizeMode: 'contain',
    marginLeft: -25,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconButton: {
    padding: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageText: {
    color: Colors.primary,
    marginLeft: Spacing.xs,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: BordersAndShadows.borderRadius.md,
    ...BordersAndShadows.shadows.md,
    padding: Spacing.sm,
  },
  languageDropdown: {
    top: 60, 
    right: 110,
  },
  menuDropdown: {
    top: 60,
    right: 20,
  },
  dropdownItem: {
    padding: Spacing.md,
  },
  dropdownItemText: {
    fontSize: Typography.fontSizes.md,
  },
});

export default Header;