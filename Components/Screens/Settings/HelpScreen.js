import { View, Text, StyleSheet, Pressable } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from "react-native-vector-icons/Ionicons";
import Animated, { FadeInDown } from 'react-native-reanimated';

// Make sure the export is properly defined
export default function HelpScreen({ navigation }) {
    const [expandedFaq, setExpandedFaq] = useState(null);

    const faqs = [
        {
            question: "How do I place an order?",
            answer: "Browse products, add items to your cart, and proceed to checkout. Follow the payment instructions to complete your order."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept credit cards, debit cards, and mobile payment solutions."
        },
        {
            question: "How can I track my order?",
            answer: "Once your order is shipped, you'll receive a tracking number via email to monitor your delivery status."
        },
        {
            question: "What is your return policy?",
            answer: "We offer a 30-day return policy for unused items in original packaging. Contact support to initiate a return."
        }
    ];

    const supportOptions = [
        {
            icon: 'mail-outline',
            title: 'Email Support',
            subtitle: 'Get help via email'
        },
        {
            icon: 'call-outline',
            title: 'Phone Support',
            subtitle: 'Speak with our team'
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </Pressable>
                <Text style={styles.headerTitle}>Help & Support</Text>
                <View style={styles.placeholderButton} />
            </View>

            <Animated.ScrollView 
                showsVerticalScrollIndicator={false}
                style={styles.content}
            >
                <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
                {faqs.map((faq, index) => (
                    <Animated.View 
                        key={index}
                        entering={FadeInDown.duration(400).delay(index * 100)}
                    >
                        <Pressable 
                            style={styles.faqItem}
                            onPress={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        >
                            <View style={styles.faqHeader}>
                                <Text style={styles.faqQuestion}>{faq.question}</Text>
                                <Ionicons 
                                    name={expandedFaq === index ? "chevron-up" : "chevron-down"} 
                                    size={24} 
                                    color="#666"
                                />
                            </View>
                            {expandedFaq === index && (
                                <Text style={styles.faqAnswer}>{faq.answer}</Text>
                            )}
                        </Pressable>
                    </Animated.View>
                ))}

                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Contact Support</Text>
                {supportOptions.map((option, index) => (
                    <Animated.View 
                        key={index}
                        entering={FadeInDown.duration(400).delay((index + faqs.length) * 100)}
                    >
                        <Pressable style={styles.supportItem}>
                            <View style={styles.supportItemLeft}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name={option.icon} size={24} color="#FF385C" />
                                </View>
                                <View>
                                    <Text style={styles.supportItemTitle}>{option.title}</Text>
                                    <Text style={styles.supportItemSubtitle}>{option.subtitle}</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="#666" />
                        </Pressable>
                    </Animated.View>
                ))}
            </Animated.ScrollView>
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
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: '#333',
    },
    backButton: {
        padding: 8,
    },
    placeholderButton: {
        width: 40,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: 'Poppins-SemiBold',
        color: '#333',
        marginBottom: 16,
    },
    faqItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    faqQuestion: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        color: '#333',
        flex: 1,
        marginRight: 8,
    },
    faqAnswer: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#666',
        marginTop: 12,
        lineHeight: 20,
    },
    supportItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    supportItemLeft: {
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
    supportItemTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        color: '#333',
    },
    supportItemSubtitle: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#666',
    },
});
