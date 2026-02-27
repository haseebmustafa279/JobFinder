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