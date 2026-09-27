import { StyleSheet, Text, View } from 'react-native';

// Placeholder until the map screen lands (WAY-3).
export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wayfinder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
});
