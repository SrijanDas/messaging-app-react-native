import React, { useLayoutEffect, useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Button, Avatar, Text, Image } from "react-native-elements";
import { db, storage } from "../firebase";
import { StatusBar } from "expo-status-bar";
import { KeyboardAvoidingView, TouchableWithoutFeedback } from "react-native";
import { Keyboard } from "react-native";
import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import firebase from "firebase";
import { Alert } from "react-native";

const AddChatScreen = ({ navigation }) => {
  const [input, setInput] = useState("");
  const [image, setImage] = useState(
    "https://image.flaticon.com/icons/png/512/2076/2076114.png"
  );
  // const [progress, setProgress] = useState(0);
  // const [url, setUrl] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add a new chat",
      headerBackTitle: "Chats",
    });
  }, []);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const handleUpload = async (fileName) => {
    console.log("Uploading");
  };

  const createChat = async () => {
    const fileName = "defaultChatIcon.jpg";
    await db
      .collection("chats")
      .add({
        chatName: input,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        chatIcon: fileName,
      })
      .then(() => {
        setInput("");
        navigation.goBack();
      })
      .catch((error) => {
        alert(error);
      });
  };

  const takePhoto = () => {
    console.log("Taking Photo");
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <StatusBar style="light" />
      <>
        <View style={styles.imageContainer}>
          <Text style={{ marginBottom: 2 }} h3>
            Chat Icon
          </Text>
          <Avatar
            rounded
            containerStyle={styles.chatIcon}
            size={150}
            source={{ uri: image }}
          />

          <Button
            onPress={takePhoto}
            containerStyle={styles.button}
            title="Take Photo"
          />
          <Button
            onPress={pickImage}
            containerStyle={styles.button}
            title="Choose Photo"
          />
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
          containerStyle={styles.button}
          disabled={!input}
          onPress={createChat}
          title="Create a new Chat"
        />
      </>
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
    width: 250,
  },
});
