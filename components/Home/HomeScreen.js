import axios from "axios";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, View, StyleSheet } from "react-native";
import Cards from "./Cards";
import NewPostButton from "./NewPostButton";
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://192.168.1.23:3000/api/posts');

      const postsWithUser = await Promise.all(response.data.map(async (post) => {
        const userResponse = await axios.get(`http://192.168.1.23:3000/api/user/${post.userId}`);
        const user = userResponse.data;

        return { ...post, user };
      }));

      setPosts(postsWithUser);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>ChitChat</Text>
        {posts.map((post) => (
          <Cards key={post.id} post={post} />
        ))}
      </ScrollView>
      <NewPostButton navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
    color: "#84AD5B",
  },
});

export default HomeScreen;
