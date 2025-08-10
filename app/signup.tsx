import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView, Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function SignupPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phonenumber, setPhoneNumber] = useState('');

    const handleSignup = async () => {
        if (!username || !email || !phonenumber) {
            Alert.alert('Please fill all the fields');
            return;
        }

        try {
            const response = await fetch('https://bookworm-backend-092v.onrender.com/api/user/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    email,
                    phonenumber,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                await AsyncStorage.setItem('phonenumber', data.phonenumber);
                await AsyncStorage.setItem("email", data.email);
                await AsyncStorage.setItem("username", data.username);
                Alert.alert('Success', data.otp);
                router.replace("/verify");
            } else {
                Alert.alert('Signup Failed', 'Something went wrong');
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
                <View style={styles.formview}>
                    <View style={styles.imageview}>
                        <Text style={styles.imagetext}>BookWorm🐛</Text>
                        <Text style={styles.imagetext2}>Share your favourite reads here</Text>
                    </View>
                    <Text style={styles.label}>Username</Text>
                    <View style={styles.inputview}>
                        <Ionicons
                            name="person-outline"
                            size={20}
                            color="#4CAF50"
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.inputbox}
                            placeholder="Enter your username"
                            placeholderTextColor="#767676"
                            autoCapitalize="none"
                            value={username}
                            onChangeText={setUsername}
                        />
                    </View>

                    <Text style={styles.label2}>Email</Text>
                    <View style={styles.inputview}>
                        <Ionicons
                            name="mail-outline"
                            size={20}
                            color="#4CAF50"
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.inputbox}
                            placeholder="Enter your email address"
                            placeholderTextColor="#767676"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    <Text style={styles.label2}>Phone Number</Text>
                    <View style={styles.inputview}>
                        <Ionicons
                            name="call-outline"
                            size={20}
                            color="#4CAF50"
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.inputbox}
                            placeholder="Enter your phone number"
                            placeholderTextColor="#767676"
                            autoCapitalize="none"
                            value={phonenumber}
                            onChangeText={setPhoneNumber}
                        />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleSignup}>
                        <Text style={styles.buttontext}>Signup</Text>
                    </TouchableOpacity>

                    <Text style={styles.footer}>Already have an account ?
                        <TouchableOpacity style={styles.footerbutton} onPress={() => { router.push("/") }}>
                            <Text style={styles.footertext}>Login</Text>
                        </TouchableOpacity>
                    </Text>
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
        alignItems: "center",
    },
    imagetext: {
        fontSize: 32,
        fontWeight: "700",
        fontFamily: "Poppins-Medium",
        color: "#4CAF50",
        marginBottom: 8,
    },
    imagetext2: {
        textAlign: "center",
        fontSize: 16,
        fontFamily: "Poppins-Regular",
        color: "#688f68",
        marginBottom: 32,
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
        borderColor: "#c8e6c9",
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        color: "black",
        fontFamily: "Poppins-Regular",
        marginLeft: 4,
        fontWeight: "500",
    },
    label2: {
        fontSize: 14,
        color: "black",
        marginLeft: 4,
        fontFamily: "Poppins-Regular",
        marginTop: 16,
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
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginTop: 16
    },
    buttontext: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        fontWeight: "500",
        alignSelf: "center",
        color: "black",
    },
    footer: {
        flexDirection: "row",
        alignSelf: "center",
        fontSize: 14,
        alignItems:"center",
        fontFamily: "Poppins-Medium",
        justifyContent: "center",
        fontWeight: "500",
        marginTop: 16,
    },
    footertext: {
        fontSize: 14,
        fontWeight: "500",
        color: "#4CAF50",
        alignSelf: "center",
        fontFamily: "Poppins-Medium",
        marginLeft: 4,
        marginTop:1
    },
    footerbutton: {
        alignSelf: "center",
    }
});
