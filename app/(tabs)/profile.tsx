import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from 'expo-image';
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import StarRating from "react-native-star-rating-widget";

export default function HomePage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [books, setBooks] = useState([]);
    const [rating, setRating] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [deleteBookId, setDeleteBookId] = useState(null);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const storedUsername = await AsyncStorage.getItem("username");
                const storedEmail = await AsyncStorage.getItem("email");

                if (storedUsername) setUsername(storedUsername);
                if (storedEmail) setEmail(storedEmail);
            } catch (error) {
                console.error("Failed to load user data", error);
            }
        };

        loadUserData();
    }, []);

    const fetchData = async () => {
        const token = await AsyncStorage.getItem("token");

        try {
            const response = await fetch(`https://bookworm-backend-092v.onrender.com/api/book/user`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch user books");

            setBooks(data);
        } catch (error) {
            console.error("Error fetching data:", error);
            Alert.alert("Error", "Failed to load profile data. Pull down to refresh.");
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    const handleDeleteBook = async (bookId: React.SetStateAction<null>) => {
        const token = await AsyncStorage.getItem("token");

        try {
            setDeleteBookId(bookId);

            const response = await fetch(`https://bookworm-backend-092v.onrender.com/api/book/${bookId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to delete book");

            setBooks(books.filter((book: any) => book._id !== bookId));
            Alert.alert("Success", "Recommendation deleted successfully");
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to delete recommendation");
        } finally {
            setDeleteBookId(null);
        }
    };

    const confirmDelete = (bookId: any) => {
        Alert.alert("Delete Recommendation", "Are you sure you want to delete this recommendation?", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => handleDeleteBook(bookId) },
        ]);
    };

    const handleLogout = async () => {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
            Alert.alert('Already Logged Out', 'Please login again to continue.');
            return;
        }

        try {
            const response = await fetch('https://bookworm-backend-092v.onrender.com/api/user/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });

            if (response.ok) {
                await AsyncStorage.removeItem('token');
                router.replace('/');
            } else {
                Alert.alert('Logout Failed', 'Something went wrong');
            }

        } catch (error) {
            console.error("Logout failed", error);
            Alert.alert('Logout Failed', 'Please try again later.');
            return;
        }
    }

    const LogoutButton = () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel", style: "cancel" },
            { text: "Logout", onPress: handleLogout, style: "destructive" },
        ]);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const renderBookItem = ({ item }: { item: any }) => (
        <View style={styles.bookItem}>
            <Image source={item.imageUrl} style={styles.bookImage} />
            <View style={styles.bookInfo}>
                <Text style={styles.bookTitle}>{item.name}</Text>
                <Text style={styles.bookCaption} numberOfLines={2}>
                    {item.caption}
                </Text>
                <StarRating
                    rating={item.ratings}
                    onChange={(val) => setRating(Math.round(val))}
                    starSize={25}
                    style={{ marginBottom: 8, justifyContent: "center" }}
                />
                <Text style={styles.bookDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>

            <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item._id)}>
                {deleteBookId === item._id ? (
                    <ActivityIndicator size="small" color="#2e5a2e" />
                ) : (
                    <Ionicons name="trash-outline" size={20} color="#2e5a2e" />
                )}
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.profileHeader}>
                <View style={styles.profileInfo}>
                    <Image source={require("../avatar.png")} style={styles.profileImage} />
                    <View>
                        <Text style={styles.username}>{username || "Guest"}</Text>
                        <Text style={styles.email}>{email || "No email provided"}</Text>
                        <Text style={styles.memberSince}>🗓️ Joined</Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={LogoutButton}>
                <Ionicons name="log-out-outline" size={20} color="white" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            <Text style={styles.booksTitle}>Your Recommendations 📚</Text>

            <FlatList
                data={books}
                renderItem={renderBookItem}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={["#2e5a2e"]}
                        tintColor="#2e5a2e"
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="book-outline" size={50} color="#688f68" />
                        <Text style={styles.emptyText}>No recommendations yet</Text>
                        <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
                            <Text style={styles.addButtonText}>Add Your First Book</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8f5e9',
        paddingTop: 20,
        marginTop: 32,
        paddingLeft: 20,
        paddingRight: 20,
    },
    profileHeader: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f1f8f2",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: "gray",
    },
    profileInfo: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 16,
    },
    username: {
        fontSize: 20,
        fontFamily: "Poppins-Bold",
        fontWeight: "700",
        color: "#2e5a2e",
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: "black",
        fontFamily: "Poppins-Regular",
        marginBottom: 4,
    },
    memberSince: {
        fontSize: 12,
        fontFamily: "Poppins-Regular",
        color: "black",
    },
    logoutButton: {
        backgroundColor: "#2e5a2e",
        borderRadius: 12,
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    logoutText: {
        color: "white",
        fontFamily: "Poppins-Medium",
        fontWeight: "600",
        marginLeft: 8,
    },
    bookItem: {
        flexDirection: "row",
        backgroundColor: "#f1f8f2",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: "gray",
    },
    bookImage: {
        width: 70,
        height: 100,
        borderRadius: 8,
        marginRight: 12,
    },
    bookInfo: {
        flex: 1,
        justifyContent: "space-between",
    },
    bookTitle: {
        fontSize: 16,
        fontFamily: "Poppins-Medium",
        fontWeight: "600",
        color: "#2e5a2e",
        marginBottom: 4,
    },
    booksTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#2e5a2e",
        marginBottom:16
    },
    bookCaption: {
        fontSize: 14,
        fontFamily:"Poppins-Regular",
        color: "black",
        marginBottom: 4,
    },
    bookDate: {
        fontSize: 12,
        color: "#688f68",
    },
    deleteButton: {
        padding: 8,
        justifyContent: "center",
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        marginTop: 20,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#2e5a2e",
        fontFamily: "Poppins-Medium",
        marginTop: 8,
        marginBottom: 20,
        textAlign: "center",
    },
    addButton: {
        backgroundColor: "#2e5a2e",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 20,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    addButtonText: {
        color: "white",
        fontWeight: "600",
        fontFamily: "Poppins-Medium",
        fontSize: 14,
    },
});
