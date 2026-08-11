import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet } from 'react-native';
import * as Contacts from 'expo-contacts';

const ContactsComponent = () => {
  const [contacts, setContacts] = useState([]);

  const loadContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permissão Negada', 'Permissão para acessar contatos foi negada.');
      return;
    }

    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers],
      });

      if (data.length > 0) {
        setContacts(data);
      } else {
        Alert.alert('Sem Contatos', 'Nenhum contato encontrado.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao carregar os contatos.');
      console.error(error);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.contactItem}>
      <Text style={styles.contactName}>
        {item.firstName} {item.lastName}
      </Text>

      {item.phoneNumbers?.map((phone) => (
        <Text key={phone.number || phone.id} style={styles.contactDetail}>
          {phone.number}
        </Text>
      ))}

      {item.emails?.map((email) => (
        <Text key={email.email || email.id} style={styles.contactDetail}>
          {email.email}
        </Text>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="Recarregar Contatos" onPress={loadContacts} />
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  list: {
    marginTop: 20,
  },
  contactItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactDetail: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
});

export default ContactsComponent;
