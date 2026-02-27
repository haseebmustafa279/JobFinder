/*import React, { useState } from 'react';
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
    >*/
      {/* Custom Header */}
{/*      <View style={styles.header}>
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
 {/*     <View style={styles.inputContainer}>
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
};*/}

/*import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS } from '../../constants/theme';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ChatDetailScreen = ({ route, navigation }: any) => {
  const { chatId } = route.params;
  const user = auth().currentUser;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('createdAt', 'asc')
      .onSnapshot(snapshot => {
        const msgList: any[] = [];
        snapshot.forEach(doc => {
          msgList.push({ id: doc.id, ...doc.data() });
        });
        setMessages(msgList);
      });

    return unsubscribe;
  }, []);

  const sendMessage = async () => {
    if (!message.trim() || !user) return;

    const messageData = {
      text: message,
      senderId: user.uid,
      createdAt: firestore.FieldValue.serverTimestamp(),
    };

    await firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .add(messageData);

    await firestore()
      .collection('chats')
      .doc(chatId)
      .update({
        lastMessage: message,
        lastMessageTime: firestore.FieldValue.serverTimestamp(),
      });

    setMessage('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.senderId === user?.uid
                ? styles.myMessage
                : styles.otherMessage,
            ]}
          >
            <Text
              style={{
                color:
                  item.senderId === user?.uid
                    ? COLORS.white
                    : COLORS.textPrimary,
              }}
            >
              {item.text}
            </Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type message..."
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Text style={{ color: COLORS.white }}>Send</Text>
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

export default ChatDetailScreen;*/

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS } from '../../constants/theme';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ChatDetailScreen = ({ route, navigation }: any) => {
  const { chatId } = route.params;
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  const user = auth().currentUser;

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('createdAt', 'asc')
      .onSnapshot(snapshot => {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(msgs);
      });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (!message.trim() || !user) return;

    await firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .add({
        text: message,
        senderId: user.uid,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

    await firestore()
      .collection('chats')
      .doc(chatId)
      .update({
        lastMessage: message,
        lastMessageTime: firestore.FieldValue.serverTimestamp(),
      });

    setMessage('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.senderId === user?.uid
                ? styles.myMessage
                : styles.otherMessage,
            ]}
          >
            <Text
              style={{
                color:
                  item.senderId === user?.uid
                    ? COLORS.white
                    : COLORS.textPrimary,
              }}
            >
              {item.text}
            </Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Text style={{ color: COLORS.white }}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    margin: 10,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e2e8f0',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: COLORS.white,
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 25,
    paddingHorizontal: 15,
  },
  sendBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginLeft: 10,
  },
});

export default ChatDetailScreen;