import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { divide } from "react-native-reanimated";
import BadgerChatMessage from "./BadgerChatMessage";
import BadgerLoginScreen from "./BadgerLoginScreen";
import BadgerLogoutScreen from "./BadgerLogoutScreen";

function CreatePostModal(props) {
  const { modalVisible, setModalVisible, loadMessages } = props;
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");

  const handleCreatePostButtonClicked = () => {
    if (body === "" || title === "") {
      alert("You must provide both a title and content!");
      return;
    }

    fetch(`https://cs571.org/s23/hw6/api/chatroom/${props.name}/messages`, {
      method: "POST",
      headers: {
        "X-CS571-ID": "bid_6e852f5dac55e4daa62b",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        content: body,
      }),
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 200) {
          alert("Successfully posted");
          loadMessages();
          setModalVisible(false);
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{ fontSize: 30 }}>Create a Post</Text>
            <Text style={{ fontSize: 20 }}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              onChangeText={(name) => setTitle(name)}
              value={title}
            />
            <Text style={{ fontSize: 20 }}>Body</Text>
            <TextInput
              style={styles.input}
              placeholder="Body"
              onChangeText={(name) => setBody(name)}
              value={body}
            />
            <Pressable
              style={[styles.button, styles.buttonOpen]}
              onPress={() => handleCreatePostButtonClicked()}
            >
              <Text style={styles.textStyle}>CREATE POST</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function BadgerChatroomScreen(props) {
  console.log("props are", props);
  const [messages, setMessages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const loadMessages = () => {
    fetch(`https://cs571.org/s23/hw6/api/chatroom/${props.name}/messages`, {
      headers: {
        "X-CS571-ID": "bid_6e852f5dac55e4daa62b",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setMessages(json.messages);
        console.log("Wassup here");
      })
      .catch((err) => err);
  };

  useEffect(() => {
    loadMessages();
  }, [props]);

  return (
    <View style={{ flex: 1 }}>
      {props.name == "Logout" || props.name == "Login" ? (
        <>
          {props.name === "Logout" && (
            <BadgerLogoutScreen setIsLoggedIn={props.setIsLoggedIn} />
          )}
          {props.name === "Login" && (
            <BadgerLoginScreen
              handleLogin={props.handleLogin}
              setIsRegistering={props.setIsRegistering}
              message={props.warningMessage}
              setIsGuestUser={props.setIsGuestUser}
              setWarningMessage={props.setWarningMessage}
            />
          )}
        </>
      ) : (
        <>
          <CreatePostModal
            setModalVisible={setModalVisible}
            modalVisible={modalVisible}
            loadMessages={loadMessages}
            name={props.name}
          />
          {messages && messages.length > 0 ? (
            <>
              {props.isLoggedIn === true && (
                <Button
                  color="crimson"
                  title="Add post"
                  onPress={() => {
                    // Alert.alert("Hmmm...", "I should check the user's credentials first!");
                    setModalVisible(true);
                  }}
                />
              )}
              <Button
                color="grey"
                title="Refresh"
                onPress={() => {
                  // Alert.alert("Hmmm...", "I should check the user's credentials first!");
                }}
              />
              {messages.map((message) => {
                return (
                  <>
                    <BadgerChatMessage
                      key={message.id}
                      id={message.id}
                      title={message.title}
                      content={message.content}
                      poster={message.poster}
                      created={message.created}
                    />
                  </>
                );
              })}
            </>
          ) : (
            <>
              <Text style={{ margin: 100 }}>This is a chatroom screen!</Text>
            </>
          )}
        </>
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default BadgerChatroomScreen;
