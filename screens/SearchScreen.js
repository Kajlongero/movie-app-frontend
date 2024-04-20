import { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import {
  ActivityIndicator,
  Icon,
  List,
  TextInput,
  ToggleButton,
} from "react-native-paper";
import { useFetch } from "../hooks/useFetch";
import { useDebounce } from "use-debounce";
import { FlatList } from "react-native-gesture-handler";
import { MovieCard } from "../components/MovieCard";
import { BASE_API, SEARCH_MOVIES } from "../utils/APIS";
import { axios } from "../utils/axiosInstance";

export const SearchScreen = () => {
  const [search, setSearch] = useState("");
  const [value] = useDebounce(search, 1000);

  const [movies, setMovies] = useState({
    data: [],
    total_pages: null,
    page: 1,
  });

  const handleFetchSearch = async () => {
    try {
      const response = await axios.get(
        `${BASE_API}${SEARCH_MOVIES}?s=${value}&p=${movies.page}`
      );
      const data = response.data;
      setMovies({
        data: data.results,
        total_pages: data.total_pages,
        page: data.page,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleFetchMoreMovies = async (page) => {
    if (page > movies.total_pages) return;

    try {
      const response = await axios.get(
        `${BASE_API}${SEARCH_MOVIES}?s=${value}&p=${page}`
      );
      const data = response.data;
      console.log(data);
      setMovies({
        data: [...movies.data, ...data.results],
        page: data.page,
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    handleFetchSearch();
  }, [value]);

  useEffect(() => {
    setMovies((p) => ({
      data: [],
      total_pages: null,
      page: 1,
    }));
  }, [search]);

  return (
    <View style={s.container}>
      <View style={s.searchContainer}>
        <TextInput
          mode="outlined"
          style={s.seachInput}
          value={search}
          onChangeText={(t) => setSearch(t)}
          placeholder="Search movies or series"
          placeholderTextColor="#777"
          textColor="#fff"
          left={<TextInput.Icon icon="magnify" color="#aaa" />}
          theme={{ colors: { primary: "#ff0" } }}
          outlineColor="#ccc"
        />
      </View>
      <FlatList
        data={movies.data}
        numColumns={2}
        columnWrapperStyle={{
          gap: 16,
        }}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          gap: 16,
        }}
        style={{
          marginTop: 32,
          marginBottom: 16,
          // width: "100%",
        }}
        ListFooterComponent={
          movies.total_pages > movies.page && (
            <View style={{ marginVertical: 16, alignItems: "center" }}>
              <ActivityIndicator animating color="#ff0" size="large" />
            </View>
          )
        }
        onEndReachedThreshold={0.25}
        onEndReached={() => handleFetchMoreMovies(movies.page + 1)}
      />
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 64,
    paddingBottom: 16,
    backgroundColor: "#000",
    alignItems: "center",
  },
  searchContainer: {
    width: "85%",
    marginHorizontal: "auto",
  },
  seachInput: {
    backgroundColor: "transparent",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
  },
});
