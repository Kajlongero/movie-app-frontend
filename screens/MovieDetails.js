import { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useFetch } from "../hooks/useFetch";
import {
  MOVIE_BY_ID,
  MOVIE_COMMENTS_REVIEWS,
  SERIE_BY_ID,
  USER_COMMENT_ON_FILM,
} from "../utils/APIS";
import {
  Appbar,
  Divider,
  Icon,
  PaperProvider,
  Portal,
  Snackbar,
} from "react-native-paper";
import StarRating from "react-native-star-rating-widget";
import { WriteReview } from "../components/Reviews/WriteReview";
import { ReviewsList } from "../components/Reviews";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { EditOrDeleteReview } from "../components/Reviews/EditOrDeleteReview";
import { FlatList } from "react-native-gesture-handler";

export const MovieDetails = ({ navigation, route }) => {
  const { id, mediaType } = route.params;

  const storage = useAsyncStorage("token");

  const [movieData, setMovieData] = useState();
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);

  const { loading, error, clearError, handleFetch } = useFetch(
    mediaType === "movie" ? `${MOVIE_BY_ID}${id}` : `${SERIE_BY_ID}${id}`,
    "GET"
  );

  const {
    loading: loadingReviews,
    error: errorReviews,
    clearError: clearErrorReviews,
    handleFetch: handleFetchReviews,
  } = useFetch(`${MOVIE_COMMENTS_REVIEWS}${id}`, "GET");

  const {
    loading: loadingUserReviews,
    error: errorUserReviews,
    clearError: clearErrorUserReviews,
    handleFetch: handleFetchUserReviews,
  } = useFetch(`${USER_COMMENT_ON_FILM}${id}`, "GET");

  const handleFetchMovie = async () => {
    const token = await storage.getItem();

    const petition = await Promise.all([
      handleFetch(undefined, {}),
      handleFetchReviews(undefined, {}),
      handleFetchUserReviews(undefined, {
        Authorization: `Bearer ${token}`,
      }),
    ]);

    console.log(petition[0]);

    setMovieData(petition[0]);
    setReviews(petition[1]);
    setMyReview(petition[2] ? petition[2] : null);
  };

  useEffect(() => {
    handleFetchMovie();
  }, []);

  return (
    <PaperProvider>
      <Portal>
        {loading ? (
          <View style={s.fetching}>
            <ActivityIndicator size="large" color="#ff0" animating />
          </View>
        ) : (
          <ScrollView
            style={{
              backgroundColor: "#000",
            }}
          >
            <Appbar.Header
              style={{
                backgroundColor: "#000",
              }}
            >
              <Appbar.BackAction
                onPress={() => navigation.pop()}
                color="#fff"
              />
            </Appbar.Header>
            <View style={s.infoContainer}>
              <Pressable>
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w500${movieData?.coverImage}`,
                  }}
                  style={s.imageStyle}
                />
              </Pressable>
              <View style={s.descriptionContainer}>
                <Text style={s.title} numberOfLines={3} ellipsizeMode="tail">
                  {movieData?.title}
                </Text>
                <View
                  style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
                >
                  <Icon source="clock-outline" size={16} color="#aaa" />
                  <Text style={s.releaseDate}>
                    {movieData?.releaseDate.split("T")[0]}
                  </Text>
                </View>
              </View>
            </View>
            <View style={s.categoriesContainer}>
              {movieData?.Categories.map((genre, index) => (
                <Text
                  key={`movie-id-${id}-index-${index}`}
                  style={s.categoryText}
                >
                  {genre.name}
                </Text>
              ))}
            </View>
            <View style={s.reviewsVoteAverage}>
              <StarRating
                rating={movieData?.voteAverage}
                maxStars={5}
                color="#fff"
                onChange={() => null}
                enableHalfStar={true}
              />
            </View>
            <View style={s.overviewContainer}>
              <Text style={s.overview}>{movieData?.overview}</Text>
            </View>
            <View>
              <Text
                style={{
                  color: "#fff",
                  marginVertical: 16,
                  paddingHorizontal: 24,
                  fontSize: 22,
                  fontWeight: "500",
                }}
              >
                Gallery
              </Text>
              <FlatList
                data={movieData?.FilmImages}
                renderItem={({ item }) => (
                  <Pressable>
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w500${item.url}`,
                      }}
                      style={s.imageStyle}
                    />
                  </Pressable>
                )}
                contentContainerStyle={{
                  gap: 12,
                }}
                style={{
                  marginHorizontal: 24,
                }}
                horizontal
              />
            </View>
            <View style={s.commentsContainer}>
              <Text style={s.commentsTitle}>Reviews</Text>
            </View>
            {myReview ? (
              <EditOrDeleteReview
                data={myReview}
                reviews={reviews}
                updater={setMyReview}
                setter={setReviews}
              />
            ) : (
              <WriteReview id={id} updater={setMyReview} setter={setReviews} />
            )}
            <Divider
              style={{
                marginHorizontal: 24,
                marginTop: 32,
              }}
            />
            <ReviewsList data={reviews} />
          </ScrollView>
        )}
        <Snackbar visible={errorReviews.e}>
          <Text>{errorReviews.message}</Text>
        </Snackbar>
      </Portal>
    </PaperProvider>
  );
};

const s = StyleSheet.create({
  fetching: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  infoContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
  },
  imageStyle: {
    width: 130,
    height: 180,
    borderRadius: 8,
  },
  descriptionContainer: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 16,
    flex: 1,
  },
  title: {
    color: "#fff",
    fontSize: 24,
  },
  releaseDate: {
    color: "#aaa",
    fontSize: 14,
    alignItems: "center",
  },
  categoriesContainer: {
    paddingHorizontal: 24,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  categoryText: {
    color: "#fff",
    borderColor: "#ff0",
    borderWidth: 0.8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  overviewContainer: {
    marginTop: 16,
    paddingHorizontal: 24,
  },
  overview: {
    color: "#ddd",
    fontSize: 15,
    letterSpacing: 0.25,
  },
  reviewsVoteAverage: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
  },
  commentsContainer: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  commentsTitle: {
    color: "#fff",
    fontSize: 20,
  },
});
