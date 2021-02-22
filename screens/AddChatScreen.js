import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Button, Avatar, Text } from "react-native-elements";
import { db } from "../firebase";
import { StatusBar } from "expo-status-bar";
import { KeyboardAvoidingView, TouchableWithoutFeedback } from "react-native";
import { Keyboard } from "react-native";

const AddChatScreen = ({ navigation }) => {
  const [input, setInput] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add a new chat",
      headerBackTitle: "Chats",
    });
  }, []);

  const createChat = async () => {
    await db
      .collection("chats")
      .add({
        chatName: input,
      })
      .then(() => {
        setInput("");
        navigation.goBack();
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <StatusBar style="light" />
      <TouchableWithoutFeedback>
        <>
          <View style={styles.imageContainer}>
            <Text style={{ marginBottom: 2 }} h3>
              Chat Icon
            </Text>
            <Avatar
              rounded
              containerStyle={styles.chatIcon}
              size={150}
              source={{
                uri:
                  "https://icons-for-free.com/iconfiles/png/512/camera-131965017355314519.png",
              }}
            />

            <Button containerStyle={styles.button} title="Take Photo" />
            <Button containerStyle={styles.button} title="Choose Photo" />
          </View>
          <Input
            containerStyle={styles.chatName}
            placeholder="Enter chat name"
            value={input}
            onChangeText={(text) => {
              setInput(text);
            }}
            onSubmitEditing={createChat}
          />
          <Button
            disabled={!input}
            onPress={createChat}
            title="Create a new Chat"
          />
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default AddChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white",
  },
  imageContainer: {
    alignItems: "center",
  },
  chatIcon: {},
  button: {
    width: 200,
    marginTop: 10,
  },
  chatName: {
    marginTop: 10,
  },
});
