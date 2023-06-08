import { Alert, Button, StyleSheet, Text, View, TextInput } from "react-native";
import React, { useState, useEffect } from "react";

function BadgerRegisterScreen(props) {
  const [password, setPassword] = useState("");
  const [retypePassword, setretypePassword] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    props.setWarningMessage("");
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 36 }}>Join BadgerChat!</Text>
      {/* <Text>Hmmm... I should add inputs here!</Text> */}
      <Text style={{ fontSize: 17 }}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Username!"
        onChangeText={(name) => setUsername(name)}
        value={username}
      />
      <Text style={{ fontSize: 17 }}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password!"
        onChangeText={(name) => setPassword(name)}
        value={password}
      />
      <Text style={{ fontSize: 17 }}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        placeholder="retype Password!"
        onChangeText={(name) => setretypePassword(name)}
        value={retypePassword}
      />
      <Text style={{ fontSize: 16, color: "red" }}>{props.message}</Text>

      <Button
        color="crimson"
        title="Signup"
        onPress={() => props.handleSignup(username, password, retypePassword)}
      />
      <Button
        color="grey"
        title="Home Screen!"
        onPress={() => props.setIsRegistering(false)}
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

export default BadgerRegisterScreen;
