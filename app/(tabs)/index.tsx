import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';

const App = () => {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState<string[]>([]);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  const addTodo = () => {
    if (todo.trim()) {
      setTodos([...todos, todo]);
      setTodo('');
    }
  };

  const toggleCheck = (index: number) => {
    if (checkedItems.includes(index)) {
      setCheckedItems(checkedItems.filter(item => item !== index));
    } else {
      setCheckedItems([...checkedItems, index]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ルーレット履歴を入力</Text>
      <TextInput
        style={styles.input}
        placeholder="ルーレット履歴を入力"
        value={todo}
        onChangeText={(text) => {
          // Allow only float values
          const floatText = text.replace(/[^0-9.]/g, '');
          setTodo(floatText);
        }}
        keyboardType="numeric"
      />
      <Button title="追加" onPress={addTodo} />
      <FlatList
        data={todos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => toggleCheck(index)}>
            <Text style={[styles.todo, checkedItems.includes(index) && styles.checkedTodo]}>
              {index + 1} 回目. {item}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
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
  checkedTodo: {
    color: 'red',
  },
});

export default App;
