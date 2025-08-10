import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {useSafeAreaInsets} from "react-native-safe-area-context";

export default function TabLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#4CAF50",
                headerTitleStyle: {
                    color: "#2e5a2e",
                    fontWeight: "600",
                },
                headerShadowVisible: false,
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: "gray",
                    paddingTop: 5,
                    paddingBottom: insets.bottom,
                    height: 60 + insets.bottom,
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({size }) => <Ionicons name="home" color="#2e5a2e" size={size} />,
                }}
            />
            <Tabs.Screen
                name="create"
                options={{
                    title: 'Add Books',
                    headerShown: false,
                    tabBarIcon: ({size }) => <Ionicons name="add-circle" color="#2e5a2e" size={size} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    headerShown: false,
                    tabBarIcon: ({size }) => <Ionicons name="person" color="#2e5a2e" size={size} />,
                }}
            />
        </Tabs>
    );
}
