import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function AboutScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </Pressable>
                <Text style={styles.headerTitle}>About</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>App Version</Text>
                    <Text style={styles.sectionText}>1.0.0</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About Us</Text>
                    <Text style={styles.sectionText}>
                        Welcome to our e-commerce platform! We strive to provide the best shopping experience
                        with a wide range of quality products and excellent customer service.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact</Text>
                    <Text style={styles.sectionText}>Email: support@example.com</Text>
                    <Text style={styles.sectionText}>Phone: +212 6 23 45 67 89</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Follow Us</Text>
                    <View style={styles.socialLinks}>
                        <Pressable style={styles.socialButton}>
                            <Ionicons name="logo-facebook" size={24} color="#FF385C" />
                            <Text style={styles.socialText}>Facebook</Text>
                        </Pressable>
                        <Pressable style={styles.socialButton}>
                            <Ionicons name="logo-instagram" size={24} color="#FF385C" />
                            <Text style={styles.socialText}>Instagram</Text>
                        </Pressable>
                        <Pressable style={styles.socialButton}>
                            <Ionicons name="logo-twitter" size={24} color="#FF385C" />
                            <Text style={styles.socialText}>Twitter</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Poppins-SemiBold',
        color: '#333',
    },
    backButton: {
        padding: 8,
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    section: {
        marginBottom: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: '#333',
        marginBottom: 8,
    },
    sectionText: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: '#666',
        lineHeight: 24,
    },
    socialLinks: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
    },
    socialButton: {
        alignItems: 'center',
        padding: 8,
    },
    socialText: {
        marginTop: 4,
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        color: '#666',
    },
});
