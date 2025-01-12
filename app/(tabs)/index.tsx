import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity, Modal } from 'react-native';

const App = () => {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState<string[]>([]);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTodoIndex, setCurrentTodoIndex] = useState<number | null>(null);
  const [editTodo, setEditTodo] = useState('');

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

  const openEditModal = (index: number) => {
    setCurrentTodoIndex(index);
    setEditTodo(todos[index]);
    setIsModalVisible(true);
  };

  const saveEditTodo = () => {
    if (currentTodoIndex !== null && editTodo.trim()) {
      const updatedTodos = [...todos];
      updatedTodos[currentTodoIndex] = editTodo;
      setTodos(updatedTodos);
      setIsModalVisible(false);
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
          <View style={styles.todoContainer}>
            <TouchableOpacity onPress={() => toggleCheck(index)} style={styles.todoTextContainer}>
              <Text style={[styles.todo, checkedItems.includes(index) && styles.checkedTodo]}>
                {index + 1} 回目. {item}
              </Text>
            </TouchableOpacity>
            <Button title="修正" onPress={() => openEditModal(index)} />
          </View>
        )}
      />
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>修正</Text>
          <TextInput
            style={styles.input}
            placeholder="修正内容を入力"
            value={editTodo}
            onChangeText={(text) => {
              // Allow only float values
              const floatText = text.replace(/[^0-9.]/g, '');
              setEditTodo(floatText);
            }}
            keyboardType="numeric"
          />
          <Button title="保存" onPress={saveEditTodo} />
          <Button title="キャンセル" onPress={() => setIsModalVisible(false)} />
        </View>
      </Modal>
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
  todoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  todoTextContainer: {
    flex: 1,
  },
  todo: {
    marginRight: 10,
  },
  checkedTodo: {
    color: 'red',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default App;