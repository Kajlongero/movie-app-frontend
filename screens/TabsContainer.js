import { useState } from "react";
import { BottomNavigation } from "react-native-paper";
import { InitialScreen } from "./InitialScreen";
import { ChatScreen } from "./ChatScreen";
import { SearchScreen } from "./SearchScreen";
import { CategoriesScreen } from "./CategoriesScreen";
import { ProfileScreen } from "./ProfileScreen";

export const TabsContainer = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: "home",
      title: "Home",
      focusedIcon: "home-circle",
      unfocusedIcon: "home-circle-outline",
    },
    {
      key: "chat",
      title: "Chat",
      focusedIcon: "chat",
      unfocusedIcon: "chat-outline",
    },
    {
      key: "movie-search",
      title: "Search",
      focusedIcon: "movie-search",
      unfocusedIcon: "movie-search-outline",
    },
    // {
    // key: "categories",
    // title: "Categories",
    // focusedIcon: "movie-filter",
    // unfocusedIcon: "movie-filter-outline",
    // },
    {
      key: "settings",
      title: "Settings",
      focusedIcon: "cog",
      unfocusedIcon: "cog-outline",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: InitialScreen,
    chat: ChatScreen,
    "movie-search": SearchScreen,
    // categories: CategoriesScreen,
    settings: ProfileScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      activeIndicatorStyle={{
        backgroundColor: "transparent",
      }}
      barStyle={{
        backgroundColor: "#000",
      }}
      activeColor="#ffff00"
      inactiveColor="#fff"
    />
  );
};
