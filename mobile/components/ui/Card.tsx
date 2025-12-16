import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export function Card({ children, style }: CardProps) {
    return <View style={[styles.card, style]}>{children}</View>;
}

interface CardHeaderProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export function CardHeader({ children, style }: CardHeaderProps) {
    return <View style={[styles.header, style]}>{children}</View>;
}

interface CardTitleProps {
    children: React.ReactNode;
    style?: TextStyle;
}

export function CardTitle({ children, style }: CardTitleProps) {
    return <Text style={[styles.title, style]}>{children}</Text>;
}

interface CardContentProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export function CardContent({ children, style }: CardContentProps) {
    return <View style={[styles.content, style]}>{children}</View>;
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    content: {
        padding: 16,
    },
});
