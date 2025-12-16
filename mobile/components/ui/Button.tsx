import React from 'react';
import {
    TouchableOpacity,
    Text,
    ActivityIndicator,
    StyleSheet,
    ViewStyle,
    TextStyle,
} from 'react-native';

interface ButtonProps {
    children: React.ReactNode;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    isLoading?: boolean;
    style?: ViewStyle;
}

export function Button({
    children,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    isLoading = false,
    style,
}: ButtonProps) {
    const buttonStyles = [
        styles.base,
        styles[variant],
        styles[`${size}Size`],
        disabled && styles.disabled,
        style,
    ];

    const textStyles = [
        styles.text,
        styles[`${variant}Text`],
        styles[`${size}Text`],
        disabled && styles.disabledText,
    ];

    return (
        <TouchableOpacity
            style={buttonStyles}
            onPress={onPress}
            disabled={disabled || isLoading}
            activeOpacity={0.8}
        >
            {isLoading ? (
                <ActivityIndicator
                    color={variant === 'primary' ? '#ffffff' : '#6366f1'}
                    size="small"
                />
            ) : (
                <Text style={textStyles}>{children}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        gap: 8,
    },
    primary: {
        backgroundColor: '#6366f1',
    },
    secondary: {
        backgroundColor: '#f3f4f6',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    ghost: {
        backgroundColor: 'transparent',
    },
    smSize: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    mdSize: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    lgSize: {
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        fontWeight: '600',
    },
    primaryText: {
        color: '#ffffff',
    },
    secondaryText: {
        color: '#374151',
    },
    ghostText: {
        color: '#6366f1',
    },
    smText: {
        fontSize: 14,
    },
    mdText: {
        fontSize: 16,
    },
    lgText: {
        fontSize: 18,
    },
    disabledText: {
        opacity: 0.7,
    },
});
