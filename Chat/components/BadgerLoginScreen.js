import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";

function BadgerLoginScreen(props) {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (props && props.setWarningMessage) {
      props.setWarningMessage("");
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 36 }}>BadgerChat Login</Text>
      <Text style={{ fontSize: 20 }}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Username!"
        onChangeText={(name) => setUsername(name)}
        value={username}
      />
      <Text style={{ fontSize: 20 }}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password!"
        onChangeText={(name) => setPassword(name)}
        value={password}
      />
      <Text style={{ fontSize: 16, color: "red" }}>{props.message}</Text>
      <Button
        color="crimson"
        title="Login"
        onPress={() => {
          // Alert.alert("Hmmm...", "I should check the user's credentials first!");
          props.handleLogin(username, password);
        }}
      />
      <Button
        color="grey"
        title="Signup"
        onPress={() => props.setIsRegistering(true)}
      />
      <Button
        color="crimson"
        title="Continue as Guest"
        onPress={() => props.setIsGuestUser(true)}
      />
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default BadgerLoginScreen;
