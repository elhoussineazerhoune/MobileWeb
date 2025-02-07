import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Image,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';

const COLORS = {
    primary: '#2C4E80',
    secondary: '#4CAF50',
    error: '#FF5252',
    background: '#F5F7FA',
    inputBg: '#FFFFFF',
    text: '#333333',
    placeholder: '#999999',
};

const tailles = [
    { label: "S", value: "S" },
    { label: "M", value: "M" },
    { label: "L", value: "L" },
    { label: "XL", value: "XL" },
    { label: "XXL", value: "XXL" },
];


const CreateArticle = () => {
    const [categories, setCategories] = useState([
        { label: "Men", value: 1 },
        { label: "Women", value: 2 },
        { label: "Kids", value: 3 },
    ]);
    const [formData, setFormData] = useState({
        nom: '',
        puv: '',
        stock: '',
        categorie_id: '',
        description: '',
        size: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [categorie, setCategorie] = useState('');

    const handleCategorieChange = (item) => {
        setCategorie(item.value);
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.nom) newErrors.nom = 'Le nom est requis';
        if (!formData.puv) newErrors.puv = 'Le prix est requis';
        if (!formData.stock) newErrors.stock = 'Le stock est requis';
        if (!categorie) newErrors.categorie = 'La catégorie est requise';
        if (!formData.size) newErrors.size = 'La taille est requise';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const takephotofromlibrary = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                quality: 0.8,
                maxHeight: 500,
                maxWidth: 500,
            });

            if (!result.didCancel && result.assets[0]) {
                setImage({
                    uri: result.assets[0].uri,
                    type: result.assets[0].type,
                    name: result.assets[0].fileName || 'photo.jpg'
                });
            }
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de charger l\'image');
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs requis');
            return;
        }

        if (!image) {
            Alert.alert('Erreur', 'Veuillez sélectionner une image');
            return;
        }

        setIsLoading(true);
        try {
            // Create FormData instance
            const formDataToSend = new FormData();

            // Append all form fields
            formDataToSend.append('nom', formData.nom);
            formDataToSend.append('puv', formData.puv);
            formDataToSend.append('stock', formData.stock);
            formDataToSend.append('categorie_id', String(categorie)); // Ensure it's sent as string in FormData
            formDataToSend.append('size', formData.size);
            formDataToSend.append('description', formData.description);

            // Append image file
            const imageUri = Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri;
            const filename = image.uri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image';

            formDataToSend.append('image', {
                uri: imageUri,
                name: filename,
                type: type
            });

            const response = await axios.post(
                'http://10.0.2.2:3306/api/article/add',
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data.success) {
                Alert.alert('Succès', response.data.message);
                // Reset form
                setFormData({
                    nom: '',
                    puv: '',
                    stock: '',
                    categorie_id: '',
                    description: '',
                    size: ''
                });
                setImage(null);
                setCategorie('');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Une erreur est survenue';
            Alert.alert('Erreur', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: COLORS.background }]}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Nouvel Article</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nom</Text>
                    <TextInput
                        style={[styles.input, errors.nom && styles.inputError]}
                        value={formData.nom}
                        onChangeText={(text) => {
                            setFormData({ ...formData, nom: text });
                            setErrors({ ...errors, nom: null });
                        }}
                        placeholder="Nom de l'article"
                    />
                    {errors.nom && <Text style={styles.errorText}>{errors.nom}</Text>}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Prix de vente</Text>
                    <TextInput
                        style={[styles.input, errors.puv && styles.inputError]}
                        value={formData.puv}
                        onChangeText={(text) => {
                            setFormData({ ...formData, puv: text });
                            setErrors({ ...errors, puv: null });
                        }}
                        keyboardType="numeric"
                        placeholder="Prix"
                    />
                    {errors.puv && <Text style={styles.errorText}>{errors.puv}</Text>}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Stock</Text>
                    <TextInput
                        style={[styles.input, errors.stock && styles.inputError]}
                        value={formData.stock}
                        onChangeText={(text) => {
                            setFormData({ ...formData, stock: text });
                            setErrors({ ...errors, stock: null });
                        }}
                        keyboardType="numeric"
                        placeholder="Quantité en stock"
                    />
                    {errors.stock && <Text style={styles.errorText}>{errors.stock}</Text>}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Catégorie</Text>
                    <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={categories}
                        maxHeight={200}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus ? 'Sélectionnez la catégorie' : '...'}
                        value={formData.categorie_id}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            handleCategorieChange(item);
                            setIsFocus(false);
                        }}
                    />
                    {/* {errors.categorie && <Text style={styles.errorText}>{errors.categorie}</Text>} */}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Taille</Text>
                    <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={tailles}
                        maxHeight={200}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus ? 'Sélectionnez la taille' : '...'}
                        value={formData.size}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            setFormData({ ...formData, size: item.value });
                            setErrors({ ...errors, size: null });
                            setIsFocus(false);
                        }}
                    />
                    {errors.size && <Text style={styles.errorText}>{errors.size}</Text>}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.textArea, errors.description && styles.inputError]}
                        value={formData.description}
                        onChangeText={(text) => {
                            setFormData({ ...formData, description: text });
                            setErrors({ ...errors, description: null });
                        }}
                        multiline
                        numberOfLines={4}
                        placeholder="Description de l'article"
                    />
                    {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
                </View>

                <TouchableOpacity
                    style={[styles.imageButton, image && styles.imageButtonSuccess]}
                    onPress={takephotofromlibrary}
                >
                    <Text style={styles.imageButtonText}>
                        {image ? 'Image sélectionnée' : 'Sélectionner une image'}
                    </Text>
                </TouchableOpacity>

                {image && (
                    <View style={styles.imagePreviewContainer}>
                        <Image source={{ uri: image.uri }} style={styles.preview} />
                    </View>
                )}

                <TouchableOpacity
                    style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitButtonText}>Créer l'article</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    formContainer: {
        padding: 20,
        backgroundColor: COLORS.background,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 20,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: COLORS.text,
    },
    input: {
        backgroundColor: COLORS.inputBg,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    inputError: {
        borderColor: COLORS.error,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 12,
        marginTop: 4,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    imageButton: {
        backgroundColor: COLORS.secondary,
        padding: 15,
        borderRadius: 12,
        marginVertical: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    imageButtonSuccess: {
        backgroundColor: '#2E7D32',
    },
    imagePreviewContainer: {
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 15,
    },
    preview: {
        width: '100%',
        height: 200,
        borderRadius: 12,
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 12,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    submitButtonDisabled: {
        opacity: 0.7,
    },
    dropdown: {
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 20,
        marginBottom: 12,
        marginHorizontal: 30,
        marginTop: 10,
        backgroundColor: "#fff",
        elevation: 2
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#2C4E80',
        textAlign: 'center'
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});

export default CreateArticle;
