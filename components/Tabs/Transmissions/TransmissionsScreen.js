import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Button } from "react-native";
import { FIREBASE_AUTH } from "../../../firebase";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import ReviewForm from "./ReviewForm";
import TransmissionList from "./TransmissionList";
import { Menu, Provider } from 'react-native-paper';
import FilterMenu from "./FilterMenu";

function TransmissionsScreen() {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [reviews, setReviews] = useState({ Repas: 0, Dodo: 0, Couche: 0 });
  const [comments, setComments] = useState('');
  const [dailyTransmissions, setDailyTransmissions] = useState([]);
  const [user, setUser] = useState(FIREBASE_AUTH.currentUser);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedChildId, setSelectedChildId] = useState('');
  const [isDateMenuVisible, setDateMenuVisible] = useState(false);
  const [isChildMenuVisible, setChildMenuVisible] = useState(false);
  const navigation = useNavigation();



  useEffect(() => {
    fetchChildren();
    fetchDailyTransmissions();
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setSelectedChild(null);
      setSelectedChildId('');
      setSelectedDate('');
    }, [])
  );

  const fetchChildren = async () => {
    try {
      const response = await axios.get('http://192.168.1.21:3000/api/child');
      setChildren(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des enfants:', error);
    }
  };

  const fetchDailyTransmissions = async () => {
    try {
      const response = await axios.get('http://192.168.1.21:3000/api/daily-transmissions'); // Remplacer par votre URL
      setDailyTransmissions(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des transmissions:', error);
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

  const handleCancel = () => {
    setSelectedChild(null);
    setReviews({ Repas: 0, Dodo: 0, Couche: 0 });
    setComments('');
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

    const content = comments || "Résumé de la journée";

    try {
      await axios.post('http://192.168.1.21:3000/api/daily-transmissions', {
        content,
        diapers: reviews.Couche,
        meals: reviews.Repas,
        sleep: reviews.Dodo,
        userId: user.uid,
        childId: child.id,
      });

      console.log("Reviews soumises avec succès.");
      setReviews({ Repas: 0, Dodo: 0, Couche: 0 });
      setComments('');
      setSelectedChild(null);
      fetchDailyTransmissions();
    } catch (error) {
      console.error('Erreur lors de la soumission des reviews:', error);
    }
  };

  const handleTransmissionDetails = (transmission) => {
    const child = children.find(c => c.id === transmission.childId);
    navigation.navigate('TransmissionDetails', { transmission: transmission, child: child });
  };

  return (
    <Provider>
      <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
        {!selectedChild && (
          <>
            <Text style={{ fontSize: 20, marginTop: 20, marginBottom: 20 }}>Sélectionner un enfant</Text>
            <Picker style={styles.picker} selectedValue={selectedChild} onValueChange={handleChildSelect}>
              {children.map((child, index) => (<Picker.Item key={index} label={child.name} value={child.name} />))}
            </Picker>
          </>
        )}
        {!selectedChild && (
          <View style={styles.containerFilterMenu}>
            <FilterMenu
              dailyTransmissions={dailyTransmissions}
              setDateMenuVisible={setDateMenuVisible}
              isDateMenuVisible={isDateMenuVisible}
              setSelectedDate={setSelectedDate}
              setChildMenuVisible={setChildMenuVisible}
              isChildMenuVisible={isChildMenuVisible}
              children={children}
              setSelectedChildId={setSelectedChildId}
              selectedChildId={selectedChildId}
              selectedDate={selectedDate}
            />
          </View>
        )}
        {selectedChild ? (
          <ReviewForm
            reviews={reviews}
            handleReviewChange={handleReviewChange}
            comments={comments}
            setComments={setComments}
            handleCancel={handleCancel}
            submitReviews={submitReviews}
            childName={selectedChild}
          />
        ) : (
          (selectedDate || selectedChildId) && <TransmissionList
            dailyTransmissions={dailyTransmissions.filter(transmission =>
              (!selectedDate || new Date(transmission.createdAt).toLocaleDateString() === selectedDate) &&
              (!selectedChildId || transmission.childId === selectedChildId)
            )}
            children={children}
            handleTransmissionDetails={handleTransmissionDetails}
          />
        )}
      </ScrollView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  picker: {
    height: 40,
    width: 200,
    padding: 10,
    marginTop: -20,
  },
  containerReviews: {
    marginTop: 200,
  },
  containerFilterMenu: {
    marginTop: 200,
  }
});

export default TransmissionsScreen;
