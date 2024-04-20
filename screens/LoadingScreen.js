import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ActivityIndicator, Icon } from "react-native-paper";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useFetch } from "../hooks/useFetch";
import { USER_BY_TOKEN } from "../utils/APIS";
import { useStore } from "../store/useStore";

export const LoadingScreen = ({ navigation }) => {
  const storage = useAsyncStorage("token");
  const setUser = useStore((s) => s.setUser);
  const { handleFetch } = useFetch(USER_BY_TOKEN, "GET");

  const fetchUser = async () => {
    const token = await storage.getItem();

    if (!token) navigation.replace("main");

    const user = await await handleFetch(
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );

    setUser(user);
    navigation.replace("main");
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <View style={s.container}>
      <Icon size={48} source="video-vintage" color="#ff0" />
      <Text style={s.text}>Loading...</Text>
      <Text style={s.description}>Wait a moment until we load the app!</Text>
      <ActivityIndicator animating={true} color="#ffff00" size="large" />
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 64,
    paddingVertical: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a0a",
  },
  text: {
    color: "#fff",
    fontSize: 24,
    marginTop: 8,
  },
  description: {
    color: "#fff",
    fontSize: 13,
    marginTop: 8,
    textAlign: "center",
    marginBottom: 32,
  },
});
