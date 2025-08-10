import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from 'expo-image';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView, Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get("window");

export default function VerifyPage() {
    const router = useRouter();
    const [code, setCode] = useState<string>("");

    const handleVerify = async () => {
        if (!code) {
            Alert.alert('Please fill all the fields');
            return;
        }

        const phonenumber = await AsyncStorage.getItem("phonenumber");
        try {
            const response = await fetch('https://bookworm-backend-092v.onrender.com/api/user/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phonenumber,
                    code
                }),
            });

            const data = await response.json();

            if (response.ok) {
                await AsyncStorage.setItem("token", data.token);
                router.replace("/home");
            } else {
                Alert.alert('Signup Failed', data.message || 'Something went wrong');
            }
        } catch (error) {
            Alert.alert('Error', 'Network error or server unavailable');
            console.error(error);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.container}>
                <View style={styles.imageview}>
                    <Image
                        source={require('../assets/images/i.png')}
                        style={styles.image}
                    />
                </View>
                <View style={styles.formview}>
                    <Text style={styles.label2}>Verification Code</Text>
                    <View style={styles.inputview}>
                        <Ionicons
                            name="lock-closed-outline"
                            size={20}
                            color="#4CAF50"
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.inputbox}
                            value={code}
                            keyboardType='numeric'
                            onChangeText={setCode}
                            placeholder="Enter your code here"
                            placeholderTextColor="#767676"
                            autoCapitalize="none"
                        />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleVerify}>
                        <Text style={styles.buttontext}>Verify</Text>
                    </TouchableOpacity>
                    <View style={styles.footer}>
                        <Text>Want to change number?</Text>
                        <TouchableOpacity onPress={() => router.push("/")}>
                            <Text style={styles.footertext}>Change number</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8f5e9',
        padding: 20,
        justifyContent: 'center',
    },
    imageview: {
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        width: width * 0.75,
        height: width * 0.75,
    },
    formview: {
        backgroundColor: "#f1f8f2",
        borderRadius: 16,
        padding: 24,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        borderWidth: 2,
        bottom: 250,
        borderColor: "#c8e6c9",
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        color: "black",
        marginLeft: 4,
        fontWeight: "500",
    },
    label2: {
        fontSize: 14,
        color: "black",
        marginLeft: 4,
        fontWeight: "500",
        marginBottom: 8
    },
    inputview: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f4faf5",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#c8e6c9",
        paddingHorizontal: 12,
    },
    inputbox: {
        flex: 1,
        height: 48,
        color: "black",
    },
    inputIcon: {
        marginRight: 10,
    },
    or: {
        alignSelf: "center",
        fontWeight: 500,
        marginTop: 16,
        marginBottom: 16,
    },
    button: {
        backgroundColor: "#4CAF50",
        borderRadius: 12,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 16,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    buttontext: {
        fontSize: 14,
        fontWeight: "500",
        alignSelf: "center",
        color: "black"
    },
    footer: {
        flexDirection: "row",
        alignSelf: "center",
        fontSize: 14,
        justifyContent: "center",
        fontWeight: "500",
        marginTop: 16,
    },
    footertext: {
        fontSize: 14,
        fontWeight: "500",
        color: "#4CAF50",
        marginLeft: 4,
    },
    footerbutton: {
        alignSelf: "center",
    }
});
