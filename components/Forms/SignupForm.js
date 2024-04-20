import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, Snackbar, TextInput } from "react-native-paper";
import { useFetch } from "../../hooks/useFetch";
import { CREATE_USER, USER_BY_TOKEN } from "../../utils/APIS";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useStore } from "../../store/useStore";

export const SignupForm = ({ action }) => {
  const updateFirstName = useStore((s) => s.updateFirstName);
  const updateLastName = useStore((s) => s.updateLastName);
  const updateEmail = useStore((s) => s.updateEmail);

  const setUser = useStore((s) => s.setUser);

  const storage = useAsyncStorage("token");
  const { loading, error, clearError, handleFetch } = useFetch(
    CREATE_USER,
    "post"
  );
  const {
    loading: loadingUser,
    error: errorUser,
    clearError: clearUserError,
    handleFetch: handleFetchUser,
  } = useFetch(USER_BY_TOKEN, "get");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleMakeRequest = async () => {
    clearError();

    const response = await handleFetch(form);
    const token = response.data.token;

    const userByToken = await handleFetchUser(
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );

    setUser(userByToken);

    console.log(userByToken);

    updateFirstName(userByToken.firstName);
    updateLastName(userByToken.lastName);
    updateEmail(userByToken.auth.email);

    await storage.setItem(token);
  };

  return (
    <View style={s.container}>
      <View style={s.form}>
        <Text style={s.title}>Sign up</Text>
        <View style={s.inputsContainer}>
          <TextInput
            mode="outlined"
            placeholderTextColor="#ccc"
            placeholder="First name"
            maxLength={60}
            textColor="#ccc"
            style={s.inputStyle}
            theme={{ colors: { outline: "#ccc" } }}
            value={form.firstName}
            onChangeText={(t) => setForm((p) => ({ ...p, firstName: t }))}
          />
          <TextInput
            mode="outlined"
            placeholderTextColor="#ccc"
            placeholder="Last name"
            textColor="#ccc"
            maxLength={60}
            style={s.inputStyle}
            theme={{ colors: { outline: "#ccc" } }}
            value={form.lastName}
            onChangeText={(t) => setForm((p) => ({ ...p, lastName: t }))}
          />
          <TextInput
            mode="outlined"
            placeholderTextColor="#ccc"
            placeholder="Email"
            textColor="#ccc"
            keyboardType="email-address"
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
            maxLength={32}
            style={s.inputStyle}
            theme={{ colors: { outline: "#ccc" } }}
            secureTextEntry
            value={form.password}
            onChangeText={(t) => setForm((p) => ({ ...p, password: t }))}
          />
        </View>
        {loading && <ActivityIndicator color="#ff0" size="large" animating />}
        <View style={s.signupButtonContainer}>
          <Pressable onPress={handleMakeRequest}>
            <Text style={s.signupTextStyle}>Sign up</Text>
          </Pressable>
        </View>
      </View>
      <View style={s.loginButtonContainer}>
        <Pressable onPress={() => action(0)}>
          <Text style={s.loginTextStyle}>Log in</Text>
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
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    flex: 1,
    marginTop: 48,
  },
  title: {
    color: "#ff0",
    fontSize: 24,
    fontWeight: "600",
    textAlign: "left",
  },
  inputsContainer: {
    flexDirection: "column",
    gap: 16,
    width: "80%",
  },
  inputStyle: {
    backgroundColor: "transparent",
  },
  signupButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: "#3a3a3a",
    textAlign: "center",
    width: "80%",
  },
  signupTextStyle: {
    color: "#fff",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
  },
  loginButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: "#09f",
    textAlign: "center",
    marginTop: 32,
    width: "80%",
  },
  loginTextStyle: {
    color: "#fff",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
  },
});
