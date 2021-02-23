import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Image, Platform } from "react-native";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../firebase";

export default function App() {
  const [image, setImage] = useState(
    "https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"
  );

  const [uploadedImage, setUploadedImage] = useState();

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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const uploadImage = async () => {
    // Create the file metadata
    var metadata = {
      contentType: "image/jpeg",
    };
    const imageUri = image;
    let fileName = imageUri.substring(imageUri.lastIndexOf("/") + 1);

    console.log("Uploading image", imageUri, fileName);

    await fetch(imageUri)
      .then((response) => {
        const x = response.blob();
        console.log(x);
      })
      .catch((error) => {
        console.log(error);
      });

    // const storageRef = storage.ref("image");
    // var mountainImagesRef = storageRef.child(`${fileName}`);

    // // 'file' comes from the Blob or File API
    // await mountainImagesRef
    //   .putString(file)
    //   .then((snapshot) => {
    //     console.log("Uploaded a blob or file!");
    //   })
    //   .catch((error) => console.log(error));
  };

  const getImage = async () => {
    console.log("Showing image");

    const storageRef = storage.refFromURL(
      "gs://signal-clone-d3c75.appspot.com/chatIcons/defaultChatIcon.jpg"
    );

    storageRef
      .getDownloadURL()
      .then((url) => {
        console.log(url);
        setUploadedImage(url);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
      <Button title="Upload" onPress={uploadImage} />
      <Text>Uploaded Images</Text>
      <Button title="Show uploaded image" onPress={getImage} />

      {image && (
        <Image
          source={{
            uri: uploadedImage,
          }}
          style={{ width: 200, height: 200 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
