import axios from "axios";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, View, StyleSheet } from "react-native";
import Cards from "./Cards";
import NewPostButton from "./NewPostButton";

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://192.168.1.23:3000/api/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

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
