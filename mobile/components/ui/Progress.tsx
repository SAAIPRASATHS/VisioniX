import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressProps {
    value: number;
    max?: number;
    showLabel?: boolean;
}

export function Progress({ value, max = 100, showLabel = false }: ProgressProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <View style={styles.container}>
            <View style={styles.track}>
                <View style={[styles.fill, { width: `${percentage}%` }]} />
            </View>
            {showLabel && (
                <Text style={styles.label}>{Math.round(percentage)}%</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    track: {
        flex: 1,
        height: 8,
        backgroundColor: '#e5e7eb',
        borderRadius: 4,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        backgroundColor: '#6366f1',
        borderRadius: 4,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6366f1',
        minWidth: 40,
        textAlign: 'right',
    },
});
