import { View, Text, Pressable, Image, StyleSheet, Modal } from "react-native";
import { Icon } from "react-native-paper";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

export const MovieCard = (props) => {
  const navigate = useNavigation();

  const handleNavigate = () => {
    navigate.navigate("Movie Details", {
      id: props.id,
      mediaType: props.media_type,
    });
  };

  return (
    <View style={s.card}>
      <Pressable
        onPress={handleNavigate}
        android_ripple="#fff"
        style={s.pressable}
      >
        <View style={s.innerContainer}>
          <Image
            style={s.image}
            source={{
              uri: `https://image.tmdb.org/t/p/w500${props.poster_path}`,
            }}
          />
          <View style={s.description}>
            <Text ellipsizeMode="tail" numberOfLines={2} style={s.overview}>
              {props.title ?? props.name}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const s = StyleSheet.create({
  card: {
    flexDirection: "column",
    width: 175,
    height: 278,
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    elevation: 8,
  },
  pressable: {},
  innerContainer: {
    flexDirection: "column",
    gap: 8,
  },
  image: {
    width: 175,
    height: 225,
    borderRadius: 8,
    backgroundColor: "gray",
  },
  description: {
    paddingHorizontal: 8,
    flexDirection: "column",
  },
  voteAverage: {
    flexDirection: "row",
    gap: 4,
    color: "#fff",
    fontSize: 15,
  },
  overview: {
    color: "#fff",
    fontFamily: "Roboto",
    letterSpacing: 0.5,
  },
});
