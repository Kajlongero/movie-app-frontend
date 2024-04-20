import { useContext, useEffect, useState } from "react";
import { Icon } from "react-native-paper";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { SocketContext } from "../context/SocketContext";
import { useStore } from "../store/useStore";
import { ChatContainer } from "../container/ChatContainer";

export const ChatScreen = () => {
  const user = useStore((s) => s.user);
  const { socket } = useContext(SocketContext);

  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const listener = (message) => {
      setMessages((p) => [...p, message]);
    };
    socket.on("RECEIVE_MESSAGE", listener);

    return () => socket.off("RECEIVED_MESSAGE", listener);
  }, []);

  useEffect(() => {
    // join room
    const joinRoom = () => {
      if (user.auth?.email) {
        socket.emit("JOIN_ROOM", user);
      }
    };
    joinRoom();
  }, [user]);

  const handleSendMessage = async () => {
    const obj = {
      content: text,
      date: new Date().toISOString(),
      user,
    };

    setText("");
    setMessages((p) => [...p, obj]);

    socket.emit("SEND_MESSAGE", obj);
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>General Chat</Text>
      <View style={s.chatContainer}>
        <ChatContainer messages={messages} />
      </View>
      {!user.auth?.email ? (
        <View style={s.locked}>
          <Text style={s.lockedMessage}>
            You need to log in first in order to talk
          </Text>
        </View>
      ) : (
        <View style={s.sendMessageInput}>
          <TextInput
            style={s.message}
            placeholder="Escribe un mensaje"
            placeholderTextColor="#aaa"
            value={text}
            onChangeText={(t) => setText(t)}
          />
          <View style={s.sendMessageButtonContainer}>
            <Pressable onPress={handleSendMessage}>
              <View style={s.buttonInnerContainer}>
                <Icon source="send" color="#09f" size={28} />
              </View>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
    // paddingBottom: 16,
    backgroundColor: "#000",
  },
  chatContainer: {
    flex: 1,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
  },
  sendMessageInput: {
    flexDirection: "row",
    width: "100%",
    height: 48,
    gap: 8,
    marginTop: 8,
  },
  message: {
    color: "#fff",
    backgroundColor: "#3a3a3a",
    flex: 1,
    borderRadius: 32,
    borderColor: "#3a3a3a",
    borderWidth: 2,
    paddingHorizontal: 24,
    color: "#fff",
    fontSize: 16,
  },
  sendMessageButtonContainer: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3a3a3a",
    borderRadius: 9999999,
  },
  buttonInnerContainer: {},
  locked: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 48,
    gap: 8,
    marginTop: 8,
  },
  lockedMessage: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
});
