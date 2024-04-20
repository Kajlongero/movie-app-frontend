import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { Pressable, View } from "react-native";
import { ActivityIndicator, Snackbar, TextInput } from "react-native-paper";
import { useStore } from "../../store/useStore";
import { useFetch } from "../../hooks/useFetch";
import { CREATE_COMMENT_REVIEW } from "../../utils/APIS";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import StarRating from "react-native-star-rating-widget";

export const WriteReview = ({ id, updater, setter }) => {
  const user = useStore((s) => s.user);
  const storage = useAsyncStorage("token");

  const [content, setContent] = useState("");
  const [canWrite, setCanWrite] = useState(false);
  const [score, setScore] = useState(1);

  const { loading, error, clearError, handleFetch } = useFetch(
    CREATE_COMMENT_REVIEW,
    "POST"
  );

  const handleCreateReview = async () => {
    if (content.length < 1) return;

    const token = await storage.getItem();

    const obj = {
      score: score,
      content: content,
      filmId: id,
    };

    const response = await handleFetch(obj, {
      Authorization: `Bearer ${token}`,
    });

    setter((p) => [...p, { ...response.data }]);

    updater(response.data);
    setContent("");
  };

  return !user.auth?.email ? (
    <>
      <View style={s.locked}>
        <Text style={s.lockedMessage}>
          You need to log in first in order to write a review
        </Text>
      </View>
    </>
  ) : (
    <>
      <View style={s.inputContainer}>
        <StarRating rating={score} onChange={setScore} enableHalfStar={false} />
        <TextInput
          multiline
          mode="outlined"
          textColor="#fff"
          placeholder="Write a review"
          placeholderTextColor="#999"
          maxLength={300}
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
      {loading && <ActivityIndicator animating color="#ff0" size="large" />}
      <View style={s.buttonContainer}>
        <Pressable
          onPress={() => {
            handleCreateReview();
          }}
        >
          <Text style={s.writeText}>Write review</Text>
        </Pressable>
        <Snackbar visible={error.e}>
          {error.statusCode} - {error.message}
        </Snackbar>
      </View>
    </>
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 24,
    marginTop: 24,
    backgroundColor: "#3a3a3a",
    borderRadius: 12,
  },
  writeText: {
    color: "#fff",
    paddingVertical: 16,
    fontSize: 16,
    fontWeight: "500",
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
});
