import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar, ListItem } from "react-native-elements";
import { db, storage } from "../firebase";

const CustomeListItem = ({ id, chatName, chatIcon, enterChat }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [chatIconUri, setChatIconUri] = useState();

  useEffect(() => {
    const storageRef = storage.refFromURL(
      `gs://signal-clone-d3c75.appspot.com/chatIcons/${chatIcon}`
    );
    storageRef
      .getDownloadURL()
      .then((url) => {
        console.log(url);
        setChatIconUri(url);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  useEffect(() => {
    const unsubscribe = db
      .collection("chats")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setChatMessages(snapshot.docs.map((doc) => doc.data()));
      });

    return unsubscribe;
  }, []);

  return (
    <ListItem
      onPress={() => enterChat(id, chatName, chatIconUri)}
      key={id}
      bottomDivider
    >
      <Avatar
        containerStyle={styles.avatar}
        rounded
        source={{ uri: chatIconUri }}
      />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: "800" }}>
          {chatName}
        </ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
          {/* {chatMessages?.[0]?.displayName}: {chatMessages?.[0]?.message} */}
          {chatMessages.length === 0
            ? "....."
            : `${chatMessages?.[0]?.displayName}: ${chatMessages?.[0]?.message}`}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default CustomeListItem;

const styles = StyleSheet.create({
  avatar: {
    // borderColor: "#2C6BED",
    // borderWidth: 2,
  },
});
