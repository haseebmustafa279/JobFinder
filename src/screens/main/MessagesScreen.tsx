import React from 'react';
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
};

const styles = StyleSheet.create({
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