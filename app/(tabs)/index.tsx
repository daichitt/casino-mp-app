import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';

const App = () => {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState<string[]>([]);

  const addTodo = () => {
    if (todo.trim()) {
      setTodos([...todos, todo]);
      setTodo('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todoアプリ</Text>
      <TextInput
        style={styles.input}
        placeholder="新しいTodoを入力"
        value={todo}
        onChangeText={setTodo}
      />
      <Button title="追加" onPress={addTodo} />
      <FlatList
        data={todos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.todo}>{item}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  todo: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default App;
