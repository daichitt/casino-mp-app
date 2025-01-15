import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity, Modal } from 'react-native';

const App = () => {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState<string[]>([]);
  const [jpCounts, setJpCounts] = useState<number[]>([]);
  const [differences, setDifferences] = useState<string[]>([]);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTodoIndex, setCurrentTodoIndex] = useState<number | null>(null);
  const [editTodo, setEditTodo] = useState('');

  const addTodo = () => {
    if (todo.trim()) {
      setTodos([...todos, todo]);

      // Calculate JP count for new entry
      const lastJPIndex = checkedItems.length > 0
          ? Math.max(...checkedItems)
          : -1;
      const jpCount = todos.length - lastJPIndex;
      setJpCounts([...jpCounts, jpCount]);

      // Calculate difference from previous entry
      const currentValue = parseFloat(todo);
      const previousValue = todos.length > 0 ? parseFloat(todos[todos.length - 1]) : currentValue;
      const difference = (currentValue - previousValue).toFixed(1);
      setDifferences([...differences, difference]);

      setTodo('');
    }
  };

  const toggleCheck = (index: number) => {
    const newCheckedItems = checkedItems.includes(index)
        ? checkedItems.filter(item => item !== index)
        : [...checkedItems, index];

    setCheckedItems(newCheckedItems);

    // Recalculate JP counts after toggle
    const updatedJpCounts = todos.map((_, idx) => {
      const lastJPIndex = newCheckedItems.filter(jpIdx => jpIdx < idx).length > 0
          ? Math.max(...newCheckedItems.filter(jpIdx => jpIdx < idx))
          : -1;
      return idx - lastJPIndex;
    });

    setJpCounts(updatedJpCounts);
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

      // Recalculate differences after edit
      const newDifferences = updatedTodos.map((value, index) => {
        if (index === 0) return "0.0";
        const current = parseFloat(value);
        const previous = parseFloat(updatedTodos[index - 1]);
        return (current - previous).toFixed(1);
      });
      setDifferences(newDifferences);

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
              const floatText = text.replace(/[^0-9.]/g, '');
              setTodo(floatText);
            }}
            keyboardType="numeric"
        />
        <Button title="追加" onPress={addTodo} />
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>回数</Text>
          <Text style={styles.headerCell}>JP後回数</Text>
          <Text style={styles.headerCell}>増減</Text>
          <Text style={styles.headerCell}>数値</Text>
          <Text style={styles.headerCell}>操作</Text>
        </View>
        <FlatList
            data={todos}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
                <View style={styles.todoContainer}>
                  <TouchableOpacity
                      onPress={() => toggleCheck(index)}
                      style={[styles.todoRow, checkedItems.includes(index) && styles.checkedRow]}
                  >
                    <Text style={styles.cell}>{index + 1}</Text>
                    <Text style={styles.cell}>{jpCounts[index]}</Text>
                    <Text style={[styles.cell, parseFloat(differences[index]) > 0 ? styles.positiveValue : parseFloat(differences[index]) < 0 ? styles.negativeValue : null]}>
                      {index === 0 ? '-' : differences[index]}
                    </Text>
                    <Text style={styles.cell}>{item}</Text>
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
  headerRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#333',
    marginBottom: 5,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  todoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  todoRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  checkedRow: {
    backgroundColor: '#ffebee',
  },
  positiveValue: {
    color: 'green',
  },
  negativeValue: {
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