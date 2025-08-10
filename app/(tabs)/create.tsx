import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import StarRating from 'react-native-star-rating-widget';

export default function CreatePage() {
    const [rating, setRating] = useState(0);
    const [name, setName] = useState("");
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const router = useRouter()

    const pickImage = async () => {
        try {

            if (Platform.OS !== "web") {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

                if (status !== "granted") {
                    Alert.alert("Permission Denied", "We need camera roll permissions to upload an image");
                    return;
                }
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: "images",
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.1,
                base64: true,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);

                if (result.assets[0].base64) {
                    setImageBase64(result.assets[0].base64);
                } else {
                    const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
                        encoding: FileSystem.EncodingType.Base64,
                    });
                    setImageBase64(base64);
                }
            }
        }
        catch (error) {
            console.error("Error picking image:", error);
            Alert.alert("Error", "There was a problem selecting your image");
        }
    }

    const handleSubmit = async () => {

        if (!name || !caption || !imageBase64 || !rating) {
            Alert.alert("Error", "Please fill all the fields");
            return
        }

        try {
            const token = await AsyncStorage.getItem("token");

            const fileType = image?.split(".").pop() || "jpeg";
            const imageType = `image/${fileType.toLowerCase()}`;
            const imageDataUrl = `data:${imageType};base64,${imageBase64}`;

            const response = await fetch("https://bookworm-backend-092v.onrender.com/api/book", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    caption: caption,
                    ratings: rating.toString(),
                    image: imageDataUrl
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Success", "Your Book recommendation has been posted");
            }
            else {
                Alert.alert("Error", data.message || "Something went Wrong")
            }
            setName("");
            setCaption("");
            setRating(0);
            setImage(null);
            setImageBase64(null);
            router.push("/home")
        }
        catch (error: any) {
            console.error("Error creating post:", error);
            Alert.alert("Error", error.message || "Something went wrong");
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView style={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.card}>
                    <Text style={styles.title}>
                        Add Book Recomendations
                    </Text>
                    <Text style={styles.subtitle}>Share your favourite reads with others</Text>
                    <Text style={styles.booktitle}>Book Title</Text>
                    <View style={styles.inputview}>
                        <Ionicons
                            name="book-outline"
                            size={20}
                            color="#4CAF50"
                            style={styles.inputIcon} />
                        <TextInput
                            style={styles.inputbox}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your book title"
                            placeholderTextColor="#767676"
                            autoCapitalize="none" />
                    </View>
                    <Text style={styles.ratingtitle}>Your Ratings</Text>
                    <View style={styles.ratingbox}>
                        <StarRating
                            rating={rating}
                            onChange={(val) => setRating(Math.round(val))}
                            starSize={40}
                            enableHalfStar={false}
                            enableSwiping={true}
                        />
                    </View>
                    <Text style={styles.bookimagetitle}>Book Image</Text>
                    <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                        {image ? (
                            <Image source={{ uri: image }} style={styles.previewImage} />
                        ) : (
                            <View style={styles.placeholderContainer}>
                                <Ionicons name="image-outline" size={40} color="#2e5a2e" />
                                <Text style={styles.placeholderText}>Tap to select image</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <Text style={styles.captiontitle}>Caption</Text>
                    <TextInput
                        style={styles.textArea}
                        value={caption}
                        onChangeText={setCaption}
                        placeholder="Write your review or thoughts about this book..."
                        placeholderTextColor="gray"
                        multiline
                    />

                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttontext}>Post Recomendation</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8f5e9',
        padding: 20,
        marginTop: 32,
    },
    card: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 20,
        marginVertical: 16,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: "gray",
    },
    title: {
        fontSize: 24,
        fontFamily: "Poppins-Bold",
        fontWeight: "700",
        alignSelf: "center",
        color: "#2e5a2e",
        marginTop: 8,
        marginBottom: 8
    },
    subtitle: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        alignSelf: "center",
        color: "#2e5a2e",
        marginBottom: 8,
        fontWeight: "500"
    },
    booktitle: {
        fontSize: 16,
        fontFamily: "Poppins-SemiBold",
        fontWeight: "700",
        color: "#2e5a2e",
        marginTop: 16,
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
    ratingtitle: {
        fontSize: 16,
        fontFamily: "Poppins-SemiBold",
        fontWeight: "700",
        color: "#2e5a2e",
        marginTop: 24,
        marginBottom: 8
    },
    ratingbox: {
        backgroundColor: "#f4faf5",
        borderRadius: 12,
        padding: 8,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#c8e6c9",
    },
    bookimagetitle: {
        fontSize: 16,
        fontFamily: "Poppins-SemiBold",
        fontWeight: "700",
        color: "#2e5a2e",
        marginTop: 24,
        marginBottom: 8
    },
    imagePicker: {
        width: "100%",
        height: 200,
        backgroundColor: "#f4faf5",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#c8e6c9",
        overflow: "hidden",
    },
    previewImage: {
        width: "100%",
        height: "100%",
    },
    placeholderContainer: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    placeholderText: {
        color: "gray",
        marginTop: 8,
    },
    captiontitle: {
        fontSize: 16,
        fontFamily: "Poppins-SemiBold",
        fontWeight: "700",
        color: "#2e5a2e",
        marginTop: 24,
        marginBottom: 8
    },
    textArea: {
        backgroundColor: "#e8f5e9",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#c8e6c9",
        padding: 12,
        height: 100,
        color: "black",
    },
    button: {
        backgroundColor: "#2e5a2e",
        borderRadius: 12,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 24,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 16
    },
    buttontext: {
        color: "white",
        fontSize: 16,
        fontFamily: "Poppins-Medium",
        fontWeight: "600",
    }
});
