import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import {
  ActivityIndicator,
  Snackbar,
  TextInput,
  Icon,
  Modal,
  Portal,
  PaperProvider,
} from "react-native-paper";
import { useStore } from "../store/useStore";
import { LoginForm } from "../components/Forms/LoginForm";
import { Authenticate } from "../components/Authenticate";
import { useFetch } from "../hooks/useFetch";
import { DELETE_USER, UPDATE_USER } from "../utils/APIS";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

export const ProfileScreen = ({ navigation }) => {
  const userStored = useStore((state) => state.user);
  const storage = useAsyncStorage("token");

  const { loading, error, clearError, handleFetch } = useFetch(
    UPDATE_USER,
    "patch"
  );
  const {
    loading: loadingDelete,
    error: errorDelete,
    clearError: clearErrorDelete,
    handleFetch: handleFetchDelete,
  } = useFetch(DELETE_USER, "delete");

  const [off, setOff] = useState(true);
  const [modalDelete, setModalDelete] = useState(false);

  const [user, setUser] = useState({
    firstName: userStored?.firstName,
    lastName: userStored?.lastName,
  });

  const updateFirstName = useStore((s) => s.updateFirstName);
  const updateLastName = useStore((s) => s.updateLastName);

  const clearUser = useStore((s) => s.clearUser);

  const handleEditUser = async () => {
    const token = await storage.getItem();
    if (!token) return navigation("home");

    const updateUser = await handleFetch(user, {
      Authorization: `Bearer ${token}`,
    }).catch((e) => e);

    setOff(true);

    updateFirstName(user.firstName);
    updateLastName(user.lastName);
  };

  const logout = async () => {
    await storage.removeItem();

    clearUser();
  };

  const handleDeleteAccount = async () => {
    try {
      const token = await storage.getItem();
      console.log(token);

      const deleted = await handleFetchDelete(
        {},
        {
          Authorization: `Bearer ${token}`,
        }
      );

      await storage.removeItem();

      clearUser();
      setModalDelete(false);

      setUser({
        lastName: "",
        firstName: "",
      });
    } catch (e) {
      console.error(e);
    }
  };

  if (!userStored?.auth?.email) {
    return <Authenticate setUser={setUser} />;
  }

  return (
    <PaperProvider>
      <Portal>
        <Modal
          visible={modalDelete}
          onDismiss={() => setModalDelete(false)}
          dismissableBackButton
          contentContainerStyle={{
            backgroundColor: "fff",
          }}
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: "100%",
              flexDirection: "column",
              paddingHorizontal: 16,
              paddingVertical: 24,
              borderRadius: 12,
              backgroundColor: "#3a3a3a",
              marginHorizontal: "auto",
              gap: 8,
            }}
          >
            <Text
              style={{
                color: "#fff",
              }}
            >
              Are you sure you want to delete your account?
            </Text>
            {loadingDelete && (
              <ActivityIndicator animating={true} color="#ff0" size="large" />
            )}
            <View style={s.editModify}>
              <View style={s.editContainerCancel}>
                <Pressable
                  style={s.editPressable}
                  onPress={() => {
                    setModalDelete(false);
                  }}
                >
                  <Text style={s.editText}>Cancel delete</Text>
                </Pressable>
              </View>
              <View style={s.editContainerConfirm}>
                <Pressable
                  style={s.editPressable}
                  onPress={() => {
                    handleDeleteAccount();
                  }}
                >
                  <Text style={s.editText}>Confirm delete</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        <Snackbar
          visible={errorDelete.e}
          action={{
            label: "Close",
            onPress: () => clearErrorDelete(),
          }}
          icon="alert"
          onDismiss={() => clearErrorDelete()}
          duration={10000}
        >
          {errorDelete.e && errorDelete.message}
        </Snackbar>
      </Portal>
      <View style={s.mainContainer}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={s.title}>Profile</Text>
          <View>
            <Pressable onPress={logout}>
              <Icon source="logout" size={28} color="#fff" />
            </Pressable>
          </View>
        </View>
        <View style={s.container}>
          <TextInput
            disabled={off}
            mode="outlined"
            placeholderTextColor="#ccc"
            placeholder="First name"
            textColor="#ccc"
            style={s.inputStyle}
            theme={{ colors: { surfaceDisabled: "#333", outline: "#ccc" } }}
            value={user.firstName}
            onChangeText={(t) => setUser((p) => ({ ...p, firstName: t }))}
          />
          <TextInput
            disabled={off}
            mode="outlined"
            placeholderTextColor="#ccc"
            placeholder="Last name"
            textColor="#ccc"
            style={s.inputStyle}
            theme={{ colors: { surfaceDisabled: "#333", outline: "#ccc" } }}
            value={user.lastName}
            onChangeText={(t) => setUser((p) => ({ ...p, lastName: t }))}
          />
          {loading && (
            <ActivityIndicator animating={true} color="#ff0" size="large" />
          )}
          <Snackbar
            visible={error.e}
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
          {off && (
            <View style={s.editContainer}>
              <Pressable style={s.editPressable} onPress={() => setOff(!off)}>
                <Text style={s.editText}>Edit profile</Text>
              </Pressable>
            </View>
          )}
        </View>
        {off && (
          <View style={s.deleteContainer}>
            <Pressable onPress={() => setModalDelete(true)}>
              <Text style={s.deleteText}>Delete account</Text>
            </Pressable>
          </View>
        )}
        {!off && (
          <View style={s.editModify}>
            <View style={s.editContainerCancel}>
              <Pressable
                style={s.editPressable}
                onPress={() => {
                  setUser({
                    firstName: userStored.firstName,
                    lastName: userStored.lastName,
                    email: userStored.email,
                  });
                  setOff(!off);
                }}
              >
                <Text style={s.editText}>Cancel edit</Text>
              </Pressable>
            </View>
            <View style={s.editContainerConfirm}>
              <Pressable
                style={s.editPressable}
                onPress={() => {
                  handleEditUser();
                }}
              >
                <Text style={s.editText}>Confirm edit</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </PaperProvider>
  );
};

const s = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 16,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    gap: 16,
    marginTop: 16,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
  },
  inputStyle: {
    color: "#fff",
    backgroundColor: "transparent",
    borderColor: "#fff",
  },
  editContainer: {
    padding: 16,
    backgroundColor: "#09f",
    borderRadius: 8,
    marginTop: 16,
  },
  editPressable: {},
  editText: {
    textAlign: "center",
    color: "#fff",
  },
  editModify: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  editContainerCancel: {
    width: 120,
    padding: 16,
    backgroundColor: "red",
    borderRadius: 8,
  },
  editContainerConfirm: {
    width: 120,
    padding: 16,
    backgroundColor: "green",
    borderRadius: 8,
  },
  deleteContainer: {
    padding: 16,
    backgroundColor: "red",
    borderRadius: 8,
  },
  deleteText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "500",
    textTransform: "uppercase",
  },
});
