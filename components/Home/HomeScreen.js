import axios from "axios";
import * as React from "react";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View, StyleSheet } from "react-native";
import Cards from "./Cards";
import NewPostButton from "./NewPostButton";
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://192.168.1.21:3000/api/posts');
      const postsWithUser = await Promise.all(response.data.map(async (post) => {
        const userResponse = await axios.get(`http://192.168.1.21:3000/api/user/get-user/${post.userId}`);
        const user = userResponse.data;

        return { ...post, user };
      }));

      const sortedPosts = postsWithUser.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setPosts(sortedPosts);
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

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://192.168.1.21:3000/api/posts/${postId}`);
      fetchData();
    } catch (error) {
      console.error('Erreur lors de la suppression du post:', error);
    }
  };

  const handleEdit = (updatedPost) => {
    const postIndex = posts.findIndex((p) => p.id === updatedPost.id);

    if (postIndex !== -1) {
      const updatedPosts = [...posts];
      updatedPosts[postIndex] = updatedPost;
      setPosts(updatedPosts);
    }
  };


  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={require('../../assets/logo.png')} style={{ width: 200, height: 120, marginTop: 30, marginBottom: -30 }} />
        {posts.map((post) => (
          <Cards key={post.id} post={post} onDelete={handleDelete} onEdit={handleEdit} />
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
});

export default HomeScreen;
