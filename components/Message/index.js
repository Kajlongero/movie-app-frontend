import { StyleSheet, Text, View } from "react-native";

export const Message = ({ user, content, date }) => {
  return (
    <View style={s.container}>
      <View style={s.nameContainer}>
        <Text style={s.nameTitle}>
          {user.firstName} {user.lastName}
        </Text>
      </View>
      <View style={s.contentContainer}>
        <Text style={s.content}>{content}</Text>
        <Text style={s.date}>{date}</Text>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#3a3a3a",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: 240,
  },
  nameContainer: {
    marginBottom: 4,
  },
  nameTitle: {
    color: "#ff0",
    fontSize: 15,
    textAlign: "left",
    fontWeight: "500",
  },
  contentContainer: {
    flexDirection: "column",
  },
  content: {
    color: "#fff",
    fontSize: 15,
    textAlign: "left",
  },
  date: {
    fontSize: 12,
    color: "gray",
    textAlign: "right",
  },
});
