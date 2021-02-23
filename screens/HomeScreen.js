import React, { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";
import { Avatar, Button } from "react-native-elements";
import CustomeListItem from "../components/CustomeListItem";
import { auth, db } from "../firebase";
import { LogBox } from "react-native";
import { TouchableOpacity } from "react-native";
import { AntDesign, SimpleLineIcons, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

const HomeScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);

  const signOutUser = () => {
    auth.signOut().then(() => {
      navigation.replace("Login");
    });
  };

  useEffect(() => {
    const unsubscribe = db.collection("chats").onSnapshot((snapshot) =>
      setChats(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );
    return unsubscribe;
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chats",
      headerStyle: { backgroundColor: "#fff" },
      headerTitleAlign: "center",
      headerTitleStyle: { color: "black" },
      headerTintColor: "black",
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity activeOpacity={0.5}>
            <Avatar
              onPress={signOutUser}
              rounded
              source={{ uri: auth?.currentUser?.photoURL }}
            />
          </TouchableOpacity>
        </View>
      ),

      headerRight: () => (
        <View
          style={{
            // flexDirection: "row",
            // justifyContent: "space-between",
            // width: 80,
            marginRight: 20,
          }}
        >
          <TouchableOpacity activeOpacity={0.5}>
            <Ionicons
              onPress={() => {
                navigation.navigate("AddChat");
              }}
              name="chatbubble-ellipses-outline"
              size={28}
              color="black"
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);

  const enterChat = (id, chatName, chatIconUri) => {
    navigation.navigate("Chat", {
      id,
      chatName,
      chatIconUri,
    });
  };

  return (
    <SafeAreaView>
      <StatusBar style="dark" />
      <ScrollView style={styles.container}>
        {chats.map(({ id, data: { chatName, chatIcon } }) => (
          <CustomeListItem
            key={id}
            id={id}
            chatName={chatName}
            chatIcon={chatIcon}
            enterChat={enterChat}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  button: {
    width: 200,
    marginTop: 10,
  },
});
