import React, { useLayoutEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";
import { Avatar, Input, Button, Icon } from "react-native-elements";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Keyboard } from "react-native";
import { auth, db } from "../firebase";
import firebase from "firebase";

const ChatScreen = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Avatar
            rounded
            source={{
              uri:
                "https://www.cmcaindia.org/wp-content/uploads/2015/11/default-profile-picture-gmail-2.png",
            }}
          />
          <Text
            style={{
              color: "white",
              marginLeft: 10,
              fontWeight: "700",
              fontSize: 20,
            }}
          >
            {route.params.chatName}
          </Text>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 80,
            marginRight: 20,
          }}
        >
          <TouchableOpacity>
            <FontAwesome name="video-camera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const sendMessage = () => {
    const unsubscribe = db
      .collection("chats")
      .doc(route.params.id)
      .collection("messages")
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: input,
        displayName: auth.currentUser.displayName,
        email: auth.currentUser.email,
        photoURL: auth.currentUser.photoURL,
      });

    setInput("");
    return unsubscribe;
  };

  useLayoutEffect(() => {
    const unsubscribe = db
      .collection("chats")
      .doc(route.params.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    return unsubscribe;
  }, [route]);

  const scrollViewRef = useRef();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style="light" />

      <KeyboardAvoidingView
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <>
          {/* -------------------chats-------------- */}
          <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={() =>
              scrollViewRef.current.scrollToEnd({ animated: true })
            }
            contentContainerStyle={{ paddingTop: 15, paddingBottom: 15 }}
          >
            {messages.map(({ id, data }) =>
              data.email === auth.currentUser.email ? (
                <View key={id} style={styles.reciever}>
                  <Avatar
                    position="absolute"
                    bottom={-28}
                    right={-2}
                    containerStyle={{
                      position: "absolute",
                      bottom: -28,
                      right: -2,
                    }}
                    rounded
                    size={30}
                    source={{ uri: data.photoURL }}
                  />
                  <Text style={styles.recieverText}>{data.message}</Text>
                </View>
              ) : (
                <View key={id} style={styles.sender}>
                  <Avatar
                    position="absolute"
                    bottom={-28}
                    left={-2}
                    containerStyle={{
                      position: "absolute",
                      bottom: -28,
                      left: -2,
                    }}
                    rounded
                    size={30}
                    source={{ uri: data.photoURL }}
                  />
                  <Text style={styles.senderText}>{data.message}</Text>
                  <Text style={styles.senderName}> {data.displayName} </Text>
                </View>
              )
            )}
          </ScrollView>
        </>

        {/* ---------------- send Message -------------- */}
        <View style={styles.footer}>
          <TextInput
            type="text"
            autoFocus
            placeholder="Type a message"
            style={styles.textInput}
            value={input}
            onChangeText={(text) => setInput(text)}
            onSubmitEditing={sendMessage}
          />
          <Button
            onPress={sendMessage}
            disabled={!input}
            icon={<Ionicons name="send" size={35} color={"#2C6BED"} />}
            type="clear"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    backgroundColor: "#ECECEC",
    padding: 10,
    color: "grey",
    borderRadius: 30,
  },
  reciever: {
    padding: 15,
    backgroundColor: "#2C6BED",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
    marginTop: 20,
  },
  sender: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-start",
    borderRadius: 20,
    margin: 15,
    maxWidth: "80%",
    position: "relative",
    marginTop: 20,
  },
  recieverText: {
    color: "white",
    fontWeight: "500",
  },
  senderText: {
    color: "black",
    fontWeight: "500",
  },
  senderName: {
    paddingRight: 10,
    marginTop: 5,
    fontSize: 10,
    color: "black",
  },
});
