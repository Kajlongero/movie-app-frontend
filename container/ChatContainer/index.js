import { FlatList } from "react-native-gesture-handler";
import { Message } from "../../components/Message";
import { Text, View } from "react-native";

export const ChatContainer = ({ messages }) => {
  return (
    <FlatList
      data={messages}
      renderItem={({ item }) => (
        <Message
          user={{
            firstName: item.user.firstName,
            lastName: item.user.lastName,
          }}
          content={item.content}
          date={item.date}
        />
      )}
      contentContainerStyle={{
        gap: 16,
      }}
      ListEmptyComponent={() => (
        <View
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#fff",
            }}
          >
            No hay mensajes
          </Text>
        </View>
      )}
      keyExtractor={(item, index) => {
        return `message-item-id-${item.id}-index-${index}`;
      }}
    />
  );
};
