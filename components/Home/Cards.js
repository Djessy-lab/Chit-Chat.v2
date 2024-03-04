import { Image, StyleSheet, Text, View } from "react-native";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const Cards = ({ post }) => {
  const createdAtDate = new Date(post.createdAt);
  const formattedDate = format(createdAtDate, "dd MMMM yyyy", { locale: fr });

  return (
    <View style={styles.card}>
      <Image source={{ uri: post.image }} style={styles.cardImage} />
      <Text style={styles.cardContent}>{post.content}</Text>
      <Text style={[styles.cardDate, { alignSelf: "flex-end" }]}>{formattedDate}</Text>
    </View>
  );
};


const styles = StyleSheet.create({
  card: {
    marginTop: 30,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,
    elevation: 5,
    width: "90%"
  },
  cardImage: {
    width: "100%",
    height: 200,
    borderRadius: 0,
    alignSelf: "center",
  },
  cardContent: {
    padding: 15,
    fontSize: 16,
  },
  cardDate: {
    padding: 5,
    fontSize: 10,
  },
});

export default Cards;
