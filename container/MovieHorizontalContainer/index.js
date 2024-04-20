import { StyleSheet, FlatList, Text, View } from "react-native";
import { MovieLoading } from "../../components/MovieLoading.js";
import { MovieCard } from "../../components/MovieCard/index.js";

export const MovieHorizontalContainer = ({ data, title, loading }) => {
  return (
    <View style={s.container}>
      <Text style={s.title}>{title}</Text>
      <FlatList
        data={!loading ? data : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}
        renderItem={({ item }) =>
          loading ? <MovieLoading /> : <MovieCard {...item} />
        }
        keyExtractor={(item, index) => `movie-index-${index}`}
        horizontal
        contentContainerStyle={{
          gap: 16,
        }}
      />
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  title: {
    color: "#ffff00",
    fontSize: 13,
    marginBottom: 4,
    textAlign: "left",
  },
});
