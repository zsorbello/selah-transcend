import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/reflection");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selah</Text>
      <Text style={styles.subtitle}>
        A place to collect and reflect.
      </Text>

      <Pressable style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Start Reflection</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: "#aaaaaa",
    marginBottom: 32,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111111",
  },
});