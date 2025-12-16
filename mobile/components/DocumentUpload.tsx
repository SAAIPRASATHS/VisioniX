import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { FileText, Upload, X } from 'lucide-react-native';
import { Button } from './ui/Button';
import { useLearning } from '../context/LearningContext';

export function DocumentUpload() {
    const { setDocument, documentContent } = useLearning();
    const [fileName, setFileName] = useState<string | null>(null);
    const [textInput, setTextInput] = useState('');

    const handlePickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'text/*',
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            const file = result.assets[0];

            if (file.mimeType?.includes('text') || file.name?.endsWith('.txt')) {
                const content = await FileSystem.readAsStringAsync(file.uri);

                if (content.trim().length < 50) {
                    Alert.alert('Error', 'Document content too short. Please provide at least 50 characters.');
                    return;
                }

                setFileName(file.name || 'Uploaded document');
                setDocument(content);
            } else {
                Alert.alert(
                    'Unsupported Format',
                    'Please upload a text file (.txt). For PDFs, please paste the text content directly.'
                );
            }
        } catch (error) {
            console.error('Error picking document:', error);
            Alert.alert('Error', 'Failed to read document');
        }
    };

    const handleTextChange = (text: string) => {
        setTextInput(text);
        if (text.trim().length > 0) {
            setFileName('Pasted text');
            setDocument(text);
        }
    };

    const clearDocument = () => {
        setFileName(null);
        setTextInput('');
        setDocument('');
    };

    if (documentContent) {
        return (
            <View style={styles.uploadedContainer}>
                <View style={styles.uploadedHeader}>
                    <View style={styles.fileInfo}>
                        <View style={styles.fileIcon}>
                            <FileText size={24} color="#22c55e" />
                        </View>
                        <View>
                            <Text style={styles.fileName}>{fileName}</Text>
                            <Text style={styles.fileSize}>
                                {documentContent.length.toLocaleString()} characters
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={clearDocument} style={styles.clearButton}>
                        <X size={20} color="#6b7280" />
                    </TouchableOpacity>
                </View>

                <View style={styles.preview}>
                    <Text style={styles.previewLabel}>CONTENT PREVIEW</Text>
                    <Text style={styles.previewText} numberOfLines={4}>
                        {documentContent.slice(0, 300)}...
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.dropZone} onPress={handlePickDocument}>
                <View style={styles.uploadIcon}>
                    <Upload size={32} color="#6b7280" />
                </View>
                <Text style={styles.dropTitle}>Tap to select a document</Text>
                <Text style={styles.dropSubtitle}>Supports text files up to 5MB</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
            </View>

            <TextInput
                style={styles.textArea}
                placeholder="Paste your document content here..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={6}
                value={textInput}
                onChangeText={handleTextChange}
                textAlignVertical="top"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 16,
    },
    dropZone: {
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#d1d5db',
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
        backgroundColor: '#f9fafb',
    },
    uploadIcon: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: '#e5e7eb',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    dropTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    dropSubtitle: {
        fontSize: 14,
        color: '#6b7280',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e5e7eb',
    },
    dividerText: {
        fontSize: 12,
        color: '#9ca3af',
        fontWeight: '500',
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#111827',
        minHeight: 120,
        backgroundColor: '#ffffff',
    },
    uploadedContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        padding: 16,
    },
    uploadedHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    fileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    fileIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fileName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    fileSize: {
        fontSize: 14,
        color: '#6b7280',
    },
    clearButton: {
        padding: 8,
    },
    preview: {
        backgroundColor: '#f3f4f6',
        borderRadius: 12,
        padding: 12,
    },
    previewLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#6b7280',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    previewText: {
        fontSize: 13,
        color: '#374151',
        lineHeight: 20,
    },
});
