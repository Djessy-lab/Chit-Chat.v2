import { Alert, Button, Image, StyleSheet, Text, TextInput, View } from "react-native";
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import axios from 'axios';
import { useEffect, useState } from "react";
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity } from "react-native-web";

const Cards = ({ post, onDelete, onEdit, currentUserId }) => {
  const [child, setChild] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [user, setUser] = useState(null);
  const [likes, setLikes] = useState(post.likes.length);
  const [userHasLiked, setUserHasLiked] = useState(post.likes.includes(currentUserId));
  const [comments, setComments] = useState(post.comments);
  const [newComment, setNewComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);

  const sortedComments = comments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const displayedComments = showAllComments ? sortedComments : sortedComments.slice(-1);

  const toggleCommentsDisplay = () => {
    setShowAllComments(!showAllComments);
  };

  useEffect(() => {
    const checkUserLikeStatus = async () => {
      try {
        const response = await axios.get(`http://192.168.1.21:3000/api/posts/${post.id}/check-like`, {
          params: { userId: currentUserId }
        });

        setUserHasLiked(response.data.hasLiked);
      } catch (error) {
        console.error('Erreur lors de la vérification du like:', error);
      }
    };

    checkUserLikeStatus();
  }, [post.id, currentUserId]);

  const toggleLike = async () => {
    if (userHasLiked) {
      try {
        await axios.delete(`http://192.168.1.21:3000/api/posts/${post.id}/likes`, { data: { userId: currentUserId } });
        setLikes(likes - 1);
        setUserHasLiked(false);
      } catch (error) {
        console.error('Erreur lors de la suppression du like :', error);
      }
    } else {
      try {
        await axios.post(`http://192.168.1.21:3000/api/posts/${post.id}/likes`, { userId: currentUserId });
        setLikes(likes + 1);
        setUserHasLiked(true);
      } catch (error) {
        console.error('Erreur lors de l\'ajout du like :', error);
      }
    }
  };


  const submitComment = async () => {
    if (newComment.trim()) {
      try {
        await axios.post(`http://192.168.1.21:3000/api/${post.id}/comments`, {
          userId: currentUserId,
          content: newComment,
        });

        const response = await axios.get(`http://192.168.1.21:3000/api/${post.id}/comments`);
        setComments(response.data);
        setNewComment('');
      } catch (error) {
        console.error('Erreur lors de l\'ajout d\'un commentaire :', error);
      }
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`http://192.168.1.21:3000/api/comments/${commentId}`);
      const updatedComments = comments.filter(comment => comment.id !== commentId);
      setComments(updatedComments);
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire :', error);
    }
  };



  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (post.userId) {
          const response = await axios.get(`http://192.168.1.21:3000/api/user/get-user/${post.userId}`);
          setUser(response.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'utilisateur:', error);
      }
    };

    fetchUserDetails();
  }, [post.userId]);

  useEffect(() => {
    const fetchChildDetails = async () => {
      try {
        const response = await axios.get(`http://192.168.1.21:3000/api/child/${post.childId}`);
        setChild(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'enfant:', error);
      }
    };

    fetchChildDetails();
  }, [post.childId]);





  const createdAtDate = new Date(post.createdAt);
  const formattedDate = format(createdAtDate, "dd MMMM yyyy", { locale: fr });

  const handleDeletePress = () => {
    Alert.alert(
      "Confirmer la suppression",
      "Êtes-vous sûr de vouloir supprimer ce post ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", onPress: () => onDelete(post.id) },
      ]
    );
  };

  const handleEditPress = () => {
    setEditMode(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`http://192.168.1.21:3000/api/posts/${post.id}`, {
        content: editedContent,
      });

      setEditMode(false);
      onEdit(response.data);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du post:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditedContent(post.content);
    setEditMode(false);
  };


  return (
    <View style={styles.card}>
      {editMode ? (
        <>
          <TextInput
            style={styles.editInput}
            value={editedContent}
            onChangeText={setEditedContent}
          />
          <Button title="Enregistrer" onPress={handleSaveEdit} />
          <Button title="Annuler" onPress={handleCancelEdit} />
        </>
      ) : (
        <>
          {user && (
            <View style={styles.userInfo}>
              {user.profilePicture ? (
                <Image
                  source={{ uri: user.profilePicture }}
                  style={styles.userPhoto}
                />
              ) : (
                <Image
                  source={require('../../assets/person.png')}
                  style={styles.placeholderImage}
                />
              )}
              <Text style={styles.userName}>{user.prenom} {user.nom}</Text>
            </View>
          )}

          <View style={styles.headerCardContainer}>
            <Text style={styles.cardDate}>{formattedDate}</Text>
          </View>
          <Image source={{ uri: post.image }} style={styles.cardImage} />
          <Text style={styles.cardContent}>{post.content}</Text>
          {child && (
            <Text style={[styles.cardChildName, { alignSelf: "flex-end" }]}>{child.name}</Text>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginHorizontal: 10 }}>
            <Icon name="heart" size={15} color={userHasLiked ? 'red' : 'grey'} onPress={toggleLike} />
            <Text>{likes}</Text>
          </View>
          {displayedComments
            .reverse()
            .map((comment, index) => (
              <View key={index} style={styles.commentContainer}>
                <Image
                  source={{ uri: comment.user.profilePicture || 'https://via.placeholder.com/150' }}
                  style={styles.userPhoto}
                />
                <Text style={styles.commentText}>
                  {comment.userId === currentUserId ? 'Vous' : `${comment.user.prenom} ${comment.user.nom}`} : {comment.content}
                </Text>
                {currentUserId === comment.userId && (
                  <View style={{ marginLeft: 'auto' }}>
                    <Icon
                      name="trash"
                      size={18}
                      color="#85c2c2"
                      onPress={() => deleteComment(comment.id)}
                    />
                  </View>
                )}
                <Text style={styles.dateText}>
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: fr })}
                </Text>
              </View>
            ))}

          {comments.length > 1 && (
            // <Button
            //   title={showAllComments ? "Voir moins" : "Voir plus"}
            //   onPress={toggleCommentsDisplay}
            // />

            // <TouchableOpacity onPress={toggleCommentsDisplay}>
              <Text onPress={toggleCommentsDisplay} style={styles.seeMoreButton}>{showAllComments ? "Voir moins" : "Voir plus..."} </Text>
            // </TouchableOpacity>
          )}

          <TextInput
            style={styles.input}
            multiline={true}
            numberOfLines={4}
            onChangeText={setNewComment}
            value={newComment}
            placeholder="Ajouter un commentaire..."
            textAlignVertical="top"
            returnKeyType="default"
          />
          {/* <Button title="Commenter" onPress={submitComment} /> */}
          {newComment.trim() && (

          <Text onPress={submitComment} style={styles.commentButton}>Commenter</Text>
          )}
          {currentUserId === post.userId && (
            <View style={styles.iconContainer}>
              <Icon name="trash" size={20} color={'#85c2c2'} onPress={handleDeletePress} />
              <Icon name="edit" size={20} color={'#85c2c2'} onPress={handleEditPress} />
            </View>
          )}
        </>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  card: {
    marginTop: 30,
    backgroundColor: '#f6f9f2',
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 1,
    width: "90%",
    padding: 8,
  },
  cardImage: {
    width: "100%",
    height: 300,
    borderRadius: 0,
    objectFit: "contain",
    alignSelf: "center",
  },
  cardContent: {
    padding: 15,
    fontSize: 16,
  },
  cardDate: {
    fontSize: 10,
    marginLeft: 45,
  },
  cardChildName: {
    padding: 5,
    fontSize: 14,
    marginRight: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  editInput: {
    padding: 15,
    fontSize: 16,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5,
    padding: 10,
  },
  headerCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  placeholderImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: '#ccc',
  },
  userPhoto: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentText: {
    fontSize: 14,
  },
  commentContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginVertical: 2,
    marginHorizontal: 12,
  },
  commentContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteIcon: {
    marginLeft: 'auto',
  },
  dateText: {
    fontSize: 12,
    color: '#656565',
  },
  commentAndIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  input: {
    padding: 12,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 18,
  },
  seeMoreButton: {
    color: '#85C2C2',
    alignSelf: 'center',
    marginBottom: 10,
  },

  commentButton: {
    color: '#84AD5B',
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
});

export default Cards;
