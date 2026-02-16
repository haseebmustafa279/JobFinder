import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

const ChatDetailScreen = ({ route, navigation }: any) => {
  const { name } = route.params; // Get the name of the person we are chatting with
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: '1', text: 'Hi there! I saw your application.', sender: 'other' },
    { id: '2', text: 'Hello! Yes, I am very interested in the role.', sender: 'me' },
    { id: '3', text: 'Great. Are you available for a quick call tomorrow?', sender: 'other' },
  ]);

  const sendMessage = () => {
    if (message.trim().length === 0) return;
    
    const newMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'me',
    };

    setChatHistory([...chatHistory, newMessage]);
    setMessage('');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{name}</Text>
        <View style={{ width: 30 }} />
      </View>

      <FlatList
        data={chatHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[
            styles.messageBubble, 
            item.sender === 'me' ? styles.myMessage : styles.otherMessage
          ]}>
            <Text style={[
              styles.messageText, 
              item.sender === 'me' ? { color: COLORS.white } : { color: COLORS.textPrimary }
            ]}>
              {item.text}
            </Text>
          </View>
        )}
        contentContainerStyle={{ padding: 20 }}
      />

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Text style={styles.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 15, 
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingTop: 40
  },
  backBtn: { fontSize: 24, color: COLORS.primary, fontWeight: 'bold' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginBottom: 10,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 2,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e2e8f0',
    borderBottomLeftRadius: 2,
  },
  messageText: { fontSize: 15 },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
    marginRight: 10,
  },
  sendBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  sendBtnText: { color: COLORS.white, fontWeight: 'bold' },
});

export default ChatDetailScreen;