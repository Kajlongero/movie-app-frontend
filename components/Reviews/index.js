import { FlatList, StyleSheet, Text, View } from "react-native";
import StarRating from "react-native-star-rating-widget";

const ReviewItem = (props) => {
  const { User, content, score, createdAt, updatedAt } = props;

  console.log(props);

  return (
    <View style={s.messageContainer}>
      <Text style={s.name}>
        {User.firstName} {User.lastName}
      </Text>
      <View style={s.rateInfo}>
        <StarRating
          rating={score}
          enableHalfStar={false}
          starSize={8}
          onChange={() => null}
          color="#ff0"
        />
        <Text style={s.dateReview}>{createdAt.split("T")[0]}</Text>
      </View>
      <Text style={s.content}>{content}</Text>
      {updatedAt !== createdAt && <Text style={s.edited}>Edited</Text>}
    </View>
  );
};

export const ReviewsList = ({ data }) => {
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <ReviewItem {...item} />}
      keyExtractor={(item) => item.id}
      style={{
        marginTop: 16,
        height: 600,
      }}
      contentContainerStyle={{
        paddingHorizontal: 24,
      }}
    />
  );
};

const s = StyleSheet.create({
  messageContainer: {
    width: "100%",
    padding: 16,
    backgroundColor: "transparent",
    borderColor: "#aaa",
    borderWidth: 0.75,
    borderRadius: 12,
  },
  name: {
    textTransform: "uppercase",
    color: "#fff",
    marginBottom: 8,
  },
  rateInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateReview: {
    fontSize: 12,
    color: "#aaa",
  },
  content: {
    marginTop: 8,
    marginBottom: 4,
    color: "#fff",
    width: "100%",
  },
  edited: {
    fontSize: 12,
    color: "#888",
  },
});
