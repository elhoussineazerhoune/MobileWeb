import { View, Text, StyleSheet, Image, Pressable } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from "react-native-vector-icons/Ionicons"
import Animated, { FadeInDown } from 'react-native-reanimated'

export default function SettingsScreen() {
  const settingsOptions = [
    { icon: 'person-outline', title: 'Account', subtitle: 'Personal information' },
    { icon: 'notifications-outline', title: 'Notifications', subtitle: 'Customize notifications' },
    { icon: 'lock-closed-outline', title: 'Privacy', subtitle: 'Security settings' },
    { icon: 'help-circle-outline', title: 'Help', subtitle: 'FAQ and support' },
    { icon: 'information-circle-outline', title: 'About', subtitle: 'App information' },
  ]

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Section */}
      <Animated.View 
        entering={FadeInDown.duration(400)}
        style={styles.profileSection}
      >
        <View style={styles.profileHeader}>
          <Image 
            source={require('../../assets/images/img1.jpeg')} 
            style={styles.profileImage} 
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileEmail}>john.doe@example.com</Text>
          </View>
          <Pressable style={styles.editButton}>
            <Ionicons name="create-outline" size={24} color="#FF385C" />
          </Pressable>
        </View>
      </Animated.View>

      {/* Settings Options */}
      <View style={styles.settingsSection}>
        {settingsOptions.map((option, index) => (
          <Animated.View 
            key={option.title}
            entering={FadeInDown.duration(400).delay(index * 100)}
          >
            <Pressable style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name={option.icon} size={24} color="#FF385C" />
                </View>
                <View style={styles.settingsItemText}>
                  <Text style={styles.settingsItemTitle}>{option.title}</Text>
                  <Text style={styles.settingsItemSubtitle}>{option.subtitle}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </Pressable>
          </Animated.View>
        ))}
      </View>

      <Pressable style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={24} color="#FFF" />
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  profileSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  editButton: {
    padding: 8,
  },
  settingsSection: {
    paddingTop: 20,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff0f3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingsItemText: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#333',
  },
  settingsItemSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF385C',
    marginHorizontal: 20,
    marginVertical: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});