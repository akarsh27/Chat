// Keep this here!
import "react-native-gesture-handler";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import BadgerLoginScreen from "./components/BadgerLoginScreen";

import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import BadgerLandingScreen from "./components/BadgerLandingScreen";
import BadgerChatroomScreen from "./components/BadgerChatroomScreen";
import BadgerRegisterScreen from "./components/BadgerRegisterScreen";

async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}
export async function deleteItem(key) {
  await SecureStore.deleteItemAsync(key);
}

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    alert("🔐 Here's your value 🔐 \n" + result);
  } else {
    alert("No values stored under that key.");
  }
}

const ChatDrawer = createDrawerNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isGuestUser, setIsGuestUser] = useState(false);
  const [chatrooms, setChatrooms] = useState([]);
  const [warningMessage, setWarningMessage] = useState("");

  useEffect(() => {
    fetch("https://cs571.org/s23/hw6/api/chatroom", {
      headers: {
        "X-CS571-ID": "bid_6e852f5dac55e4daa62b",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (isGuestUser === true) {
          json.push("Login");
        } else {
          json.push("Logout");
        }
        setChatrooms(json);
      });
  }, [isGuestUser, isLoggedIn]);

  function handleLogin(username, password) {
    // hmm... maybe this is helpful!
    console.log("what is username and password", username, password);
    if (username === "" || password === "") {
      alert("You must provide both a username and password!");
      return;
    }
    fetch(`https://cs571.org/s23/hw6/api/login`, {
      method: "POST",
      headers: {
        "X-CS571-ID": "bid_6e852f5dac55e4daa62b",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 401) {
          setWarningMessage("Incorrect password!");
        } else if (res.status === 404) {
          setWarningMessage("Incorrect username!");
        } else {
          alert("User login was successful.");
          // sessionStorage.setItem("userLoggedInState", "logged in");
          // sessionStorage.setItem("userName", username);
          save("userLoggedInState", "logged in");
          save("userName", username);
          setWarningMessage("");
          setIsLoggedIn(true);
        }
      })
      .catch((error) => console.log(error));

    // setIsLoggedIn(true); // I should really do a fetch to login first!
  }

  function handleSignup(username, password, retypePassword) {
    // hmm... maybe this is helpful!
    if (username === "" || password === "") {
      setWarningMessage("username or password is empty");
    }
    if (password !== retypePassword) {
      setWarningMessage("Passwords do not match");
      setPassword("");
      setretypePassword("");
    }

    fetch(`https://cs571.org/s23/hw6/api/register`, {
      method: "POST",
      headers: {
        "X-CS571-ID": "bid_6e852f5dac55e4daa62b",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 409) {
          setWarningMessage("User already exists");
        } else {
          setWarningMessage("User registered successfully");
          setUsername("");
          setPassword("");
          setretypePassword("");
          setIsLoggedIn(true);
        }
      })
      .catch((error) => console.log(error));
  }

  if (isLoggedIn || isGuestUser) {
    return (
      <NavigationContainer>
        <ChatDrawer.Navigator>
          <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {chatrooms.map((chatroom) => {
            return (
              <ChatDrawer.Screen key={chatroom} name={chatroom}>
                {(props) => (
                  <BadgerChatroomScreen
                    name={chatroom}
                    setIsLoggedIn={setIsLoggedIn}
                    isLoggedIn={isLoggedIn}
                    isGuestUser={isGuestUser}
                    handleLogin={handleLogin}
                    setIsRegistering={setIsRegistering}
                    message={warningMessage}
                    setIsGuestUser={setIsGuestUser}
                  />
                )}
              </ChatDrawer.Screen>
            );
          })}
        </ChatDrawer.Navigator>
      </NavigationContainer>
    );
  } else if (isRegistering) {
    return (
      <BadgerRegisterScreen
        handleSignup={handleSignup}
        setIsRegistering={setIsRegistering}
        message={warningMessage}
        setWarningMessage={setWarningMessage}
      />
    );
  } else {
    return (
      <BadgerLoginScreen
        handleLogin={handleLogin}
        setIsRegistering={setIsRegistering}
        message={warningMessage}
        setIsGuestUser={setIsGuestUser}
        setWarningMessage={setWarningMessage}
      />
    );
  }
}
