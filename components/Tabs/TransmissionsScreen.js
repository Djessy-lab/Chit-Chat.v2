import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

function TransmissionsScreen() {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [reviews, setReviews] = useState({
    Repas: 0,
    Dodo: 0,
    Couche: 0
  });

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const response = await axios.get('http://192.168.1.21:3000/api/child');
      setChildren(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des enfants:', error);
    }
  };

  const handleChildSelect = (child) => {
    setSelectedChild(child);
  };

  const handleReviewChange = (type, value) => {
    setReviews(prevReviews => ({
      ...prevReviews,
      [type]: value
    }));
  };

  const submitReviews = async () => {
    console.log("Reviews soumises:", reviews);
    setReviews({
      Repas: 0,
      Dodo: 0,
      Couche: 0
    });
    setSelectedChild(null);
  };


  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text
          style={{ fontSize: 30, fontWeight: 'bold', marginTop: 20 }}
        >
          Transmission
        </Text>
        <Text>
          Sélectionner un enfant
        </Text>
        {selectedChild && (
          <Text>
            Enfant sélectionné: {selectedChild}
          </Text>
        )}
        <View>
          <Picker
            style={styles.picker}
            onValueChange={(itemValue) => handleChildSelect(itemValue)}
            selectedValue={selectedChild}
          >
            {children.map((child, index) => (
              <Picker.Item key={index} label={child.name} value={child.name} />
            ))}
          </Picker>
        </View>
        <View style={styles.containerReviews}>
        {selectedChild && (
          <>
            <Text>Reviews :</Text>
            <View style={styles.reviewContainer}>
              <Text>Repas:</Text>
              <View style={styles.reviewIcons}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <TouchableOpacity key={i} onPress={() => handleReviewChange("Repas", i)}>
                    <Image
                      source={require('../../assets/repas-icon.png')}
                      style={[styles.icon]}
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
                      style={[styles.icon]}
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
                      style={[styles.icon]}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity onPress={submitReviews} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Soumettre</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  picker: {
    height: 40,
    width: 150,
    borderRadius: 4,
    padding: 8,
    backgroundColor: 'transparent',
    marginTop: 10,
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
    width: 20,
    height: 20,
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: 'blue',
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
