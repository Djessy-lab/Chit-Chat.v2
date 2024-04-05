import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Image, ScrollView, Text, View, StyleSheet } from "react-native";
import Cards from "./Cards";
import NewPostButton from "./NewPostButton";
import { useFocusEffect } from '@react-navigation/native';
import { FIREBASE_AUTH } from "../../firebase";

const HomeScreen = ({ navigation }) => {
  const auth = FIREBASE_AUTH;
  const [posts, setPosts] = useState([]);

  const fetchChildren = async () => {
    try {
      const response = await axios.get(`http://192.168.1.21:3000/api/user/get-user/${auth.currentUser.uid}`);
      return response.data.children;
    } catch (error) {
      console.error('Erreur lors de la récupération des enfants:', error);
    }
  };


  const fetchPosts = async () => {
    try {
      const children = await fetchChildren();

      const response = await axios.get('http://192.168.1.21:3000/api/posts');
      const allPosts = response.data;

      const filteredPosts = allPosts.filter(post => {
        return children && children.some(child => post.childId === child.id);
      });

      const sortedPosts = filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setPosts(sortedPosts);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  };


  useEffect(() => {
    fetchPosts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://192.168.1.21:3000/api/posts/${postId}`);
      fetchPosts();
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
          <Cards key={post.id} post={post} onDelete={handleDelete} onEdit={handleEdit} currentUserId={auth.currentUser.uid} />
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
