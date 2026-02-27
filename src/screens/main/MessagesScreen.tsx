/*import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

const MOCK_CHATS = [
  { id: '1', name: 'HR - Tech Corp', lastMsg: 'When can you join?', time: '10:30 AM', unread: 2 },
  { id: '2', name: 'OZ Tech Stack', lastMsg: 'Your interview is scheduled.', time: 'Yesterday', unread: 0 },
];

const MessagesScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Messages</Text>
      
      <FlatList
        data={MOCK_CHATS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.chatItem}
            onPress={() => navigation.navigate('ChatDetail', { name: item.name })}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
            </View>
            
            <View style={styles.chatInfo}>
              <View style={styles.row}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <Text style={styles.lastMsg} numberOfLines={1}>{item.lastMsg}</Text>
            </View>
            
            {item.unread > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unread}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};*/

/*import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const MessagesScreen = ({ navigation }: any) => {
  const [chats, setChats] = useState<any[]>([]);
  const user = auth().currentUser;

  useEffect(() => {
    if (!user) return;

    const unsubscribe = firestore()
      .collection('chats')
      .where('participants', 'array-contains', user.uid)
      .orderBy('lastMessageTime', 'desc')
      .onSnapshot(snapshot => {
        const chatList: any[] = [];
        snapshot.forEach(doc => {
          chatList.push({ id: doc.id, ...doc.data() });
        });
        setChats(chatList);
      });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Messages</Text>

      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const otherUserId =
            item.companyId === user?.uid
              ? item.candidateId
              : item.companyId;

          return (
            <TouchableOpacity
              style={styles.chatItem}
              onPress={() =>
                navigation.navigate('ChatDetail', {
                  chatId: item.id,
                  otherUserId,
                })
              }
            >
              <View style={styles.chatInfo}>
                <Text style={styles.name}>Chat</Text>
                <Text style={styles.lastMsg} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};*/

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const MessagesScreen = ({ navigation }: any) => {
  const [chats, setChats] = useState<any[]>([]);

  /* useEffect(() => {
     const user = auth().currentUser;
     if (!user) return;
 
     const unsubscribe = firestore()
       .collection('chats')
       .where('participants', 'array-contains', user.uid)
       .orderBy('lastMessageTime', 'desc')
       .onSnapshot(snapshot => {
         const chatList = snapshot.docs.map(doc => ({
           id: doc.id,
           ...doc.data(),
         }));
         setChats(chatList);
       });
 
     return () => unsubscribe();
   }, []);*/

  useEffect(() => {
    const user = auth().currentUser;
    if (!user) return;

    const unsubscribe = firestore()
      .collection('chats')
      .where('participants', 'array-contains', user.uid)
      .orderBy('lastMessageTime', 'desc')
      .onSnapshot(
        (snapshot) => {
          if (!snapshot) {
            setChats([]);
            return;
          }

          const chatList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          setChats(chatList);
        },
        (error) => {
          console.log("Chats fetch error:", error);
          setChats([]);
        }
      );

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Messages</Text>

      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() =>
              navigation.navigate('ChatDetail', { chatId: item.id })
            }
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.lastMessage?.charAt(0) || "C"}
              </Text>
            </View>

            <View style={styles.chatInfo}>
              <Text style={styles.name}>Chat</Text>
              <Text style={styles.lastMsg} numberOfLines={1}>
                {item.lastMessage || "No messages yet"}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No chats available</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },

  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  container: { flex: 1, backgroundColor: COLORS.background, padding: SIZES.medium },
  header: { fontSize: 24, fontWeight: 'bold', color: COLORS.textPrimary, marginTop: 20, marginBottom: 20 },
  chatItem: { flexDirection: 'row', backgroundColor: COLORS.white, padding: 15, borderRadius: 15, marginBottom: 10, alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.secondary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 18 },
  chatInfo: { flex: 1, marginLeft: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  name: { fontWeight: 'bold', fontSize: 16, color: COLORS.textPrimary },
  time: { fontSize: 12, color: COLORS.textSecondary },
  lastMsg: { fontSize: 14, color: COLORS.textSecondary, marginTop: 3 },
  unreadBadge: { backgroundColor: COLORS.primary, width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  unreadText: { color: COLORS.white, fontSize: 10, fontWeight: 'bold' }
});

export default MessagesScreen;