import { FlatList } from "react-native-gesture-handler";
import { MovieCard } from "../../components/MovieCard";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export const MovieContainer = ({ data, updater }) => {
  return (
    <FlatList
      data={data}
      numColumns={2}
      renderItem={(props) => <MovieCard {...props} />}
      keyExtractor={(item, index) => item.id}
      ListFooterComponent={() => (
        <View style={s.loader}>
          <ActivityIndicator animating={true} color="#ff0" size={36} />
        </View>
      )}
      onEndReached={updater}
      onEndReachedThreshold={0.1}
      contentContainerStyle={s.contentStyle}
    />
  );
};

const s = StyleSheet.create({
  loader: {
    marginVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  contentStyle: {
    flexWrap: "wrap",
    gap: 12,
  },
});
