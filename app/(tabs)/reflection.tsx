import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function ReflectionScreen() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (text.trim() === "") return;

    const userMessage = `You: ${text}`;
    setMessages((prev) => [...prev, userMessage]);
    setText("");
    setLoading(true);

    try {
      const response = await fetch("http://192.168.1.20:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      setMessages((prev) => [...prev, `Selah: ${data.reply}`]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        "Selah: Something went wrong connecting to the server.",
      ]);
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Reflection</Text>

        <ScrollView style={styles.chatContainer}>
          {messages.map((msg, index) => (
            <Text key={index} style={styles.message}>
              {msg}
            </Text>
          ))}
          {loading && (
            <Text style={styles.message}>Selah is thinking...</Text>
          )}
        </ScrollView>

        <TextInput
          style={styles.input}
          placeholder="Type your response..."
          placeholderTextColor="#666"
          value={text}
          onChangeText={setText}
          multiline
        />

        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 16,
  },
  chatContainer: {
    flex: 1,
    marginBottom: 12,
  },
  message: {
    color: "#ffffff",
    marginBottom: 10,
    fontSize: 16,
    lineHeight: 22,
  },
  input: {
    backgroundColor: "#1e1e1e",
    color: "#ffffff",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    minHeight: 60,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111111",
  },
});