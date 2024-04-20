import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { Pressable, View } from "react-native";
import {
  ActivityIndicator,
  Modal,
  PaperProvider,
  Portal,
  Snackbar,
  TextInput,
} from "react-native-paper";
import { useStore } from "../../store/useStore";
import { useFetch } from "../../hooks/useFetch";
import { UPDATE_COMMENT_REVIEW, DELETE_COMMENT_REVIEW } from "../../utils/APIS";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import StarRating from "react-native-star-rating-widget";

export const EditOrDeleteReview = ({ data, reviews, setter, updater }) => {
  const user = useStore((s) => s.user);
  const storage = useAsyncStorage("token");

  const [content, setContent] = useState(data.content);
  const [score, setScore] = useState(data.score);
  const [editable, setEditable] = useState(false);
  const [deleteable, setDeleteable] = useState(false);

  const { loading, error, clearError, handleFetch } = useFetch(
    `${UPDATE_COMMENT_REVIEW}${data.id}`,
    "PATCH"
  );

  const {
    loading: loadingDelete,
    error: errorDelete,
    clearError: clearErrorDelete,
    handleFetch: handleFetchDelete,
  } = useFetch(`${DELETE_COMMENT_REVIEW}${data.id}`, "DELETE");

  const handleUpdateReview = async () => {
    if (content.length < 1) return;
    if (content === data.content) return;

    const token = await storage.getItem();

    const obj = {
      filmId: data.filmId,
      score: score,
      content: content,
    };

    const response = await handleFetch(obj, {
      Authorization: `Bearer ${token}`,
    });

    const before = reviews.map((r) =>
      r.id === response.data.id ? response.data : r
    );

    console.log(`before: `, before);

    setter((p) => [...before]);
    updater(response.data);

    setContent(response.data.content);
    setScore(response.data.score);

    setEditable(false);
  };

  const handleDeleteReview = async () => {
    const token = await storage.getItem();

    const response = await handleFetchDelete(undefined, {
      Authorization: `Bearer ${token}`,
    });

    const before = reviews.filter((r) => r.id !== data.id);

    setter((p) => [...before]);
    updater(response.data);

    setDeleteable(false);
  };

  return (
    <PaperProvider>
      <Portal>
        <Modal
          visible={deleteable}
          onDismiss={() => setDeleteable(false)}
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
              Are you sure you want to delete your review?
            </Text>
            {loadingDelete && (
              <ActivityIndicator
                animating={true}
                color="#ff0"
                size="large"
                style={{ marginTop: 8 }}
              />
            )}
            <View style={s.editModify}>
              <View style={s.editContainerCancel}>
                <Pressable
                  style={s.editPressable}
                  onPress={() => {
                    setDeleteable(false);
                  }}
                >
                  <Text style={s.editText}>Cancel</Text>
                </Pressable>
              </View>
              <View style={s.editContainerConfirm}>
                <Pressable
                  style={s.editPressable}
                  onPress={() => {
                    handleDeleteReview();
                  }}
                >
                  <Text style={s.editText}>Confirm</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </Portal>
      <View style={s.inputContainer}>
        <Text style={{ fontSize: 13, color: "#fff" }}>My review</Text>
        <StarRating
          rating={score}
          onChange={editable ? setScore : () => null}
          enableHalfStar={false}
        />
        <TextInput
          multiline
          mode="outlined"
          textColor="#fff"
          placeholder="Write a review"
          placeholderTextColor="#999"
          maxLength={300}
          disabled={!editable}
          style={{
            paddingHorizontal: 4,
            paddingVertical: 16,
            backgroundColor: "transparent",
            width: "100%",
          }}
          value={content}
          onChangeText={(t) => setContent(t)}
        />
      </View>
      {loading && (
        <ActivityIndicator
          animating
          color="#ff0"
          size="large"
          style={{ marginTop: 8 }}
        />
      )}
      {!editable ? (
        <View style={s.buttonsContainer}>
          <Pressable
            onPress={() => {
              setDeleteable(true);
            }}
          >
            <Text style={s.writeText}>Delete review</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setEditable(true);
            }}
          >
            <Text style={s.writeText}>Edit review</Text>
          </Pressable>
        </View>
      ) : (
        <View style={s.buttonsContainer}>
          <Pressable
            onPress={() => {
              setEditable(false);
            }}
          >
            <Text style={s.writeText}>Cancel edit</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              handleUpdateReview();
            }}
          >
            <Text style={s.writeText}>Update review</Text>
          </Pressable>
        </View>
      )}
      <Snackbar visible={error.e}>
        {error.statusCode} - {error.message}
      </Snackbar>
    </PaperProvider>
  );
};

const s = StyleSheet.create({
  inputContainer: {
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginTop: 12,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    marginHorizontal: 24,
    marginTop: 24,
    // backgroundColor: "#3a3a3a",
    borderRadius: 12,
  },
  writeText: {
    color: "#fff",
    backgroundColor: "#3a3a3a",
    paddingVertical: 16,
    fontSize: 16,
    fontWeight: "500",
    width: 164,
    textAlign: "center",
    borderRadius: 12,
  },
  locked: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 48,
    gap: 8,
    marginTop: 8,
    backgroundColor: "#3a3a3a",
    paddingHorizontal: 24,
  },
  lockedMessage: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
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
