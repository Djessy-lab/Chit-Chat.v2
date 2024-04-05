import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button, Alert } from 'react-native';

const TransmissionDetailsScreen = ({ route }) => {
  const { transmission, child, userId } = route.params;
  const maxIcons = 5;
  const navigation = useNavigation();
  const [user, setUser] = useState('');

  const renderIcons = (count, icon) => {
    let icons = [];
    for (let i = 0; i < maxIcons; i++) {
      icons.push(
        <Image
          key={i}
          source={icon}
          style={[styles.icon, { opacity: i < count ? 1 : 0.3 }]}
        />
      );
    }
    return icons;
  };

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await fetch(`http://192.168.1.21:3000/api/user/get-user/${transmission.userId}`);
        if (response.ok) {
          const userJson = await response.json();
          setUser(userJson);
        } else {
          console.error('Erreur lors de la récupération du nom de l\'utilisateur');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du nom de l\'utilisateur:', error);
      }
    };

    fetchUserName();
  }, []);




  const handleDeleteTransmission = async () => {
    try {
      const response = await fetch(`http://192.168.1.21:3000/api/daily-transmissions/${transmission.userId}/${transmission.id}`, {
        method: 'DELETE',
      });
      console.log(response);

      if (response.ok) {
        Alert.alert("Suppression", "La transmission a été supprimée avec succès.");
        navigation.goBack();
      } else {
        console.error('Erreur lors de la suppression de la transmission');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la transmission:', error);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.headReviewContain}>
        <Text style={styles.headReview}>{child ? child.name : 'Enfant inconnu'}</Text>
        <Text style={styles.dateHeadReview}>{new Date(transmission.createdAt).toLocaleDateString()}</Text>
      </View>
      <View style={styles.contentContain}>
        <Text style={styles.contentText}>{transmission.content}</Text>
      </View>
        <Text style={styles.contentText}>{user.prenom} {user.nom} - {user.role === 'USER' ? 'Parent' : 'Nounou'}</Text>
      <View style={styles.reviewContain}>
        <View style={styles.review}>
          <Text style={styles.content}>Couches:</Text>
          <View style={styles.iconsContainer}>
            {renderIcons(transmission.diapers, require('../../../assets/couche-icon.png'))}
          </View>
        </View>
        <View style={styles.review}>
          <Text style={styles.content}>Repas: </Text>
          <View style={styles.iconsContainer}>
            {renderIcons(transmission.meals, require('../../../assets/repas-icon.png'))}
          </View>
        </View>
        <View style={styles.review}>
          <Text style={styles.content}>Sommeil: </Text>
          <View style={styles.iconsContainer}>
            {renderIcons(transmission.sleep, require('../../../assets/dodo-icon.png'))}
          </View>
        </View>
        {userId === transmission.userId && (
          <Button title="Supprimer la transmission" onPress={handleDeleteTransmission} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headReviewContain: {
    marginBottom: 20,
    height: 100,
    padding: 10,
    justifyContent: 'center',
    fontSize: 20,
  },
  headReview: {
    fontSize: 30,
    color: '#1A1E11',
    fontVariant: ['small-caps'],
    textAlign: 'center',
  },
  dateHeadReview: {
    fontSize: 20,
    color: '#1A1E11',
    textAlign: 'center',
  },
  contentContain: {
    marginBottom: 20,
    height: 100,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 8,
    width: '80%',
    height: 150,
  },
  review: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconsContainer: {
    flexDirection: 'row',
  },
  icon: {
    width: 30,
    height: 30,
    marginLeft: 2,
  },
  content: {
    fontSize: 20,
    marginRight: 10,
  },
  contentText: {
    fontSize: 15,
    color: '#1A1E11',
  },
  reviewContain: {
    marginTop: 60,
    width: '80%',
  },
});

export default TransmissionDetailsScreen;
