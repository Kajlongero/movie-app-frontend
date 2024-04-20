import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  ActivityIndicator,
  Icon,
  Snackbar,
  TextInput,
} from "react-native-paper";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useStore } from "../../store/useStore";
import { useFetch } from "../../hooks/useFetch";
import { axios } from "../../utils/axiosInstance";
import { LOGIN, USER_BY_TOKEN } from "../../utils/APIS";

export const LoginForm = ({ action, setUser }) => {
  const handleSetUser = useStore((s) => s.setUser);
  const store = useAsyncStorage("token");

  const { loading, error, clearError, handleFetch } = useFetch(LOGIN, "post");
  const {
    loading: loadingUser,
    error: errorUser,
    clearError: clearUserError,
    handleFetch: handleFetchUser,
  } = useFetch(USER_BY_TOKEN, "get");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const makeRequest = async () => {
    clearError();
    try {
      const user = await handleFetch(form);
      if (!user) return;

      const data = user.data;
      const token = data.token;

      const userByToken = await handleFetchUser(
        {},
        {
          Authorization: `Bearer ${data.token}`,
        }
      );
      handleSetUser(userByToken);

      await store.setItem(token);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={s.container}>
      <View style={s.form}>
        <Icon source="video-vintage" color="#ff0" size={64} />
        <Text style={s.title}>Login</Text>
        <View style={s.inputsContainer}>
          <TextInput
            mode="outlined"
            placeholderTextColor="#ccc"
            placeholder="Email"
            textColor="#ccc"
            style={s.inputStyle}
            theme={{ colors: { outline: "#ccc" } }}
            value={form.email}
            onChangeText={(t) => setForm((p) => ({ ...p, email: t }))}
          />
          <TextInput
            mode="outlined"
            placeholderTextColor="#ccc"
            placeholder="Password"
            textColor="#ccc"
            style={s.inputStyle}
            theme={{ colors: { outline: "#ccc" } }}
            secureTextEntry
            maxLength={32}
            value={form.password}
            onChangeText={(t) => setForm((p) => ({ ...p, password: t }))}
          />
        </View>
        {loading && <ActivityIndicator color="#ff0" size="large" animating />}
        <View style={s.loginButtonContainer}>
          <Pressable onPress={makeRequest} android_ripple="#ccc">
            <Text style={s.loginTextStyle}>Log in</Text>
          </Pressable>
        </View>
      </View>
      <View style={s.signupButtonContainer}>
        <Pressable onPress={() => action(1)}>
          <Text style={s.signupTextStyle}>Sign up</Text>
        </Pressable>
      </View>
      <Snackbar
        visible={error.e || loadingUser}
        action={{
          label: "Close",
          onPress: () => clearError(),
        }}
        icon="alert"
        onDismiss={() => clearError()}
        duration={10000}
      >
        {error.e && error.message}
      </Snackbar>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingTop: 64,
    paddingBottom: 16,
  },
  form: {
    flexDirection: "column",
    gap: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 128,
    width: "100%",
    flex: 1,
  },
  title: {
    color: "#ff0",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
  },
  inputsContainer: {
    flexDirection: "column",
    gap: 16,
    width: "80%",
  },
  inputStyle: {
    backgroundColor: "transparent",
  },
  loginButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: "#3a3a3a",
    textAlign: "center",
    width: "80%",
  },
  loginTextStyle: {
    color: "#fff",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
  },
  signupButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: "#09f",
    textAlign: "center",
    marginTop: 128,
    width: "80%",
  },
  signupTextStyle: {
    color: "#fff",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
  },
});
