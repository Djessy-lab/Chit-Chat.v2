import React from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';

const ReviewForm = ({ reviews, handleReviewChange, comments, setComments, handleCancel, submitReviews, childName }) => {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View style={styles.reviewContainer}>
        <View style={styles.headerFormContain}>
          <Text style={styles.headerForm}>Transmission du {new Date().toLocaleDateString()}</Text>
          <Text style={styles.headerForm}>Pour {childName}</Text>
        </View>
        <Text>Repas:</Text>
        <View style={styles.reviewIcons}>
          {[1, 2, 3, 4, 5].map((i) => (
            <TouchableOpacity key={i} onPress={() => handleReviewChange("Repas", i)}>
              <Image
                source={require('../../../assets/repas-icon.png')}
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
                source={require('../../../assets/dodo-icon.png')}
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
                source={require('../../../assets/couche-icon.png')}
                style={[styles.icon, { opacity: i <= reviews.Couche ? 1 : 0.5 }]}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.textarea}
          placeholder="Ajouter une remarque..."
          onChangeText={setComments}
          value={comments}
          multiline
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={submitReviews} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Soumettre</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  reviewContainer: {
    alignItems: 'center',
    marginTop: 160,
  },
  headerFormContain: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerForm: {
    fontSize: 20,
    color: '#1A1E11',
    fontVariant: ['small-caps'],
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: 300,
  },
  submitButton: {
    backgroundColor: '#84AD5B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 30,
    width: 125,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#85C2C2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 30,
    width: 125,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  textarea: {
    height: 60,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
  },
});

export default ReviewForm;
