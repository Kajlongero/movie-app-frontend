import { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ScrollView } from "react-native";
import { TRENDING_MOVIES } from "../utils/APIS";
import { MovieCard } from "../components/MovieCard";
import { useFetch } from "../hooks/useFetch";
import { MovieContainer } from "../container/MovieContainer";
import { MovieHorizontalContainer } from "../container/MovieHorizontalContainer";

export const InitialScreen = () => {
  const {
    loading: loadingDay,
    error: errorDay,
    clearError: clearErrorDay,
    handleFetch: handleFetchDay,
  } = useFetch(`${TRENDING_MOVIES}?w=day`, "GET");
  const {
    loading: loadingWeek,
    error: errorWeek,
    clearError: clearErrorWeek,
    handleFetch: handleFetchWeek,
  } = useFetch(`${TRENDING_MOVIES}?w=week`, "GET");

  const [movies, setMovies] = useState({
    day: [],
    week: [],
  });

  const fetchMovies = async () => {
    const movie = await Promise.all([
      handleFetchDay(undefined, {}),
      handleFetchWeek(undefined, {}),
    ]);

    setMovies({
      day: movie[0].results,
      week: movie[1].results,
    });
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <ScrollView style={s.container}>
      <Text style={s.title}>Home</Text>
      <View style={s.moviesContainer}>
        <MovieHorizontalContainer
          data={movies.day}
          title="Trending of the day"
          loading={loadingDay}
        />
        <MovieHorizontalContainer
          data={movies.week}
          title="Trending of the week"
          loading={loadingWeek}
        />
      </View>
    </ScrollView>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 64,
    paddingHorizontal: 24,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "500",
    marginBottom: 16,
  },
  moviesContainer: {
    flexDirection: "column",
    gap: 32,
    marginBottom: 96,
  },
});
