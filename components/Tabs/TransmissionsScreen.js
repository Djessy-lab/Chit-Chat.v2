import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { FIREBASE_AUTH } from "../../firebase"; // Assurez-vous que le chemin d'importation est correct

function TransmissionsScreen() {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [reviews, setReviews] = useState({ Repas: 0, Dodo: 0, Couche: 0 });
  const [user, setUser] = useState(FIREBASE_AUTH.currentUser);

  useEffect(() => {
    fetchChildren();
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const fetchChildren = async () => {
    try {
      const response = await axios.get('http://192.168.1.21:3000/api/child');
      setChildren(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des enfants:', error);
    }
  };

  const handleChildSelect = (childName) => {
    setSelectedChild(childName);
  };

  const handleReviewChange = (type, value) => {
    setReviews(prevReviews => ({
      ...prevReviews,
      [type]: value
    }));
  };

  const submitReviews = async () => {
    if (!selectedChild || !user) {
      console.error("Aucun enfant sélectionné ou utilisateur non connecté");
      return;
    }

    const child = children.find(c => c.name === selectedChild);
    if (!child) {
      console.error("Enfant non trouvé");
      return;
    }

    try {
      await axios.post('http://192.168.1.21:3000/api/daily-transmissions', {
        content: 'Résumé de la journée',
        diapers: reviews.Couche,
        meals: reviews.Repas,
        sleep: reviews.Dodo,
        userId: user.uid,
        childId: child.id,
      });

      console.log("Reviews soumises avec succès.");
      setReviews({ Repas: 0, Dodo: 0, Couche: 0 });
      setSelectedChild(null);
    } catch (error) {
      console.error('Erreur lors de la soumission des reviews:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 20, marginTop: 20, marginBottom: 20 }}>
          Sélectionner un enfant
        </Text>
        {selectedChild && (
          <>
            <Text style={{ fontSize: 15}} >
              Enfant sélectionné:
            </Text>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#84AD5B' }}>
              {selectedChild}
            </Text>
          </>
        )}
        <View>
          <Picker
            style={styles.picker}
            onValueChange={handleChildSelect}
            selectedValue={selectedChild}
          >
            {children.map((child, index) => (
              <Picker.Item key={index} label={child.name} value={child.name} />
            ))}
          </Picker>
        </View>
        <View style={styles.containerReviews}>
          {selectedChild && (
            <View style={styles.reviewContainer}>
              <Text>Repas:</Text>
              <View style={styles.reviewIcons}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <TouchableOpacity key={i} onPress={() => handleReviewChange("Repas", i)}>
                    <Image
                      source={require('../../assets/repas-icon.png')}
                      style={[styles.icon, { opacity: i <= reviews.Repas ? 1 : 0.5 }]}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Text>Dodo:</Text>
              <View style={styles.reviewIcons}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <TouchableOpacity key={i} onPress={() => handleReviewChange("Dodo", i)}>
                    <Image
                      source={require('../../assets/dodo-icon.png')}
                      style={[styles.icon, { opacity: i <= reviews.Dodo ? 1 : 0.5 }]}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Text>Couche:</Text>
              <View style={styles.reviewIcons}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <TouchableOpacity key={i} onPress={() => handleReviewChange("Couche", i)}>
                    <Image
                      source={require('../../assets/couche-icon.png')}
                      style={[styles.icon, { opacity: i <= reviews.Couche ? 1 : 0.5 }]}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity onPress={submitReviews} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Soumettre</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  picker: {
    height: 40,
    width: 200,
    borderRadius: 4,
    padding: 8,
    backgroundColor: 'transparent',
    marginTop: 10,
    padding: 10,
  },
  reviewContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  reviewIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  icon: {
    width: 30,
    height: 30,
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: '#84AD5B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  containerReviews: {
    marginTop: 200,
  }
});

export default TransmissionsScreen;
