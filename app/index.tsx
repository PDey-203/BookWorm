import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView, Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get("window");

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [phonenumber, setPhonenumber] = useState('');

    const [loaded] = useFonts({
        "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
        "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    });

    useEffect(() => {
        const checkToken = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (token) {
                    router.replace('/home');
                }
            } catch (error) {
                console.error('Error checking token:', error);
            }
        };

        checkToken();
    }, []);

    if (!loaded) {
        return null;
    }

    const handleLogin = async () => {
        if (!email && !phonenumber) {
            Alert.alert("Error", "Please enter your email or phone number");
            return;
        }

        const requestBody = phonenumber
            ? { phonenumber: phonenumber, email: null }
            : { phonenumber: null, email: email };

        try {
            const response = await fetch('https://bookworm-backend-092v.onrender.com/api/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (response.ok) {
                await AsyncStorage.setItem("phonenumber", String(data.phonenumber));
                await AsyncStorage.setItem("email", data.email);
                await AsyncStorage.setItem("username", data.username);
                Alert.alert('Success', `Code- ${data.otp}`);
                router.replace("/verify");
            } else {
                Alert.alert('Signin Failed', 'Something went wrong');
            }
        } catch (error) {
            Alert.alert('Error', 'Network error or server unavailable');
            console.error(error);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.container}>
                <View style={styles.imageview}>
                    <Image
                        source={require('../assets/images/i.png')}
                        style={styles.image}
                        contentFit="contain"
                    />
                </View>
                <View style={styles.formview}>
                    <Text style={styles.label}>Email</Text>
                    <View style={styles.inputview}>
                        <Ionicons name="mail-outline" size={20} color="#4CAF50" style={styles.inputIcon} />
                        <TextInput
                            style={styles.inputbox}
                            keyboardType="email-address"
                            placeholder="Enter your email address"
                            placeholderTextColor="#767676"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    <Text style={styles.or}>-----------------OR--------------------</Text>

                    <Text style={styles.label2}>Phone Number</Text>
                    <View style={styles.inputview}>
                        <Ionicons name="call-outline" size={20} color="#4CAF50" style={styles.inputIcon} />
                        <TextInput
                            style={styles.inputbox}
                            keyboardType="phone-pad"
                            placeholder="Enter your phone number"
                            placeholderTextColor="#767676"
                            value={phonenumber}
                            onChangeText={setPhonenumber}
                        />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttontext}>Login</Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={{fontFamily: "Poppins-Medium"}}>Don&#39;t have an account?</Text>
                        <TouchableOpacity onPress={() => router.push("/signup")}>
                            <Text style={styles.footertext}> Signup</Text>
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
        bottom: 225,
        borderColor: "#c8e6c9",
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        color: "black",
        marginLeft: 4,
        fontFamily: "Poppins-Regular",
        fontWeight: "500",
    },
    label2: {
        fontSize: 14,
        color: "black",
        marginLeft: 4,
        fontFamily: "Poppins-Regular",
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
        fontFamily: "Poppins-Medium",
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
        fontFamily: "Poppins-Medium",
        fontWeight: "500",
        alignSelf: "center",
        color: "black"
    },
    footer: {
        flexDirection: "row",
        alignSelf: "center",
        fontSize: 14,
        alignItems: "center",
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
    },
    footerbutton: {
        alignSelf: "center",
    }
});
