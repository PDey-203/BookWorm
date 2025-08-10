import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from 'expo-image';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View
} from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import formatPublishDate from "../utils";


export default function HomePage() {
    const router = useRouter();
    const [rating, setRating] = useState(0);
    const [books, setBooks] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchBooks = async (pageNum = 1, refresh = false) => {
        try {
            if (refresh) setRefreshing(true);
            else if (pageNum === 1) setLoading(true);

            const token = await AsyncStorage.getItem('token');
            if (!token) {
                router.replace('/');
                return;
            }

            const response = await fetch(`https://bookworm-backend-092v.onrender.com/api/book?page=${pageNum}&limit=5`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch books");

            const uniqueBooks = refresh || pageNum === 1 ? data.book : Array.from(new Set([...books, ...data.books].map((book) => book._id))).map((id) =>
                [...books, ...data.books].find((book) => book._id === id)
            );

            setBooks(uniqueBooks);
            setHasMore(pageNum < data.totalPages);
            setPage(pageNum);
        } catch (error) {
            console.error("Error fetching books:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleLoadMore = async () => {
        if (hasMore && !loading && !refreshing) {
            await fetchBooks(page + 1);
        }
    };

    useEffect(() => {
        const init = async () => {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                router.replace('/');
                return;
            }
            await fetchBooks();
        };
        init();
    });

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.bookCard}>
            <View style={styles.bookHeader}>
                <View style={styles.userInfo}>
                    <Text style={styles.username}>{item.username}</Text>
                </View>
            </View>

            <View style={styles.bookImageContainer}>
                <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.bookImage}
                    contentFit="cover"
                />
            </View>

            <View style={styles.bookDetails}>
                <Text style={styles.bookTitle}>{item.name}</Text>
                <Text style={styles.caption}>{item.caption}</Text>
                <StarRating
                    rating={item.ratings}
                    onChange={(val) => setRating(Math.round(val))}
                    starSize={25}
                    style={{ marginBottom: 8, justifyContent: "center" }}
                />
                <Text style={styles.date}>Shared on {formatPublishDate(item.createdAt)}</Text>
            </View>
        </View>
    );

    if (loading && books.length === 0) {
        return (
            <View style={[styles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color="#2e5a2e" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={books}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => fetchBooks(1, true)}
                        colors={["#2e5a2e"]}
                        tintColor="#2e5a2e"
                    />
                }
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.1}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>BookWorm 🐛</Text>
                        <Text style={styles.headerSubtitle}>Discover great reads from the community👇</Text>
                    </View>
                }
                ListFooterComponent={
                    hasMore && books.length > 0 ? (
                        <ActivityIndicator style={styles.footerLoader} size="small" color="#2e5a2e" />
                    ) : null
                }
                ListEmptyComponent={
                    !loading ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="book-outline" size={60} color="black" />
                            <Text style={styles.emptyText}>No recommendations yet</Text>
                        </View>
                    ) : null
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
    },
    bookCard: {
        backgroundColor: "white",
        borderRadius: 16,
        marginBottom: 20,
        marginEnd: 20,
        marginStart: 20,
        padding: 16,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: "gray",
    },
    bookHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    bookImageContainer: {
        width: "100%",
        height: 200,
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 12,
        backgroundColor: "gray",
    },
    bookDetails: {
        padding: 5,
        justifyContent: "center",
    },
    bookTitle: {
        fontSize: 18,
        fontFamily: "Poppins-Bold",
        fontWeight: "700",
        color: "black",
        marginBottom: 6,
    },
    caption: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        color: "black",
        marginBottom: 8,
        lineHeight: 20,
    },
    date: {
        fontSize: 12,
        fontFamily: "Poppins-Regular",
        color: "black",
    },
    username: {
        fontSize: 15,
        fontFamily: "Poppins-SemiBold",
        fontWeight: "600",
        color: "black",
    },
    header: {
        marginBottom: 20,
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: "Poppins-Bold",
        letterSpacing: 0.5,
        alignSelf: "center",
        fontWeight: "700",
        color: "#2e5a2e",
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: "black",
        fontFamily: "Poppins-Regular",
        textAlign: "center",
    },
    footerLoader: {
        marginVertical: 10,
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        marginTop: 40,
    },
    emptyText: {
        fontSize: 18,
        fontFamily: "Poppins-Regular",
        fontWeight: "600",
        color: "black",
        marginTop: 16,
        marginBottom: 8,
    },
    bookImage: {
        width: "100%",
        height: "100%",
    },
});
