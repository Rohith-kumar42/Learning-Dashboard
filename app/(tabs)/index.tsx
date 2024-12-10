import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  StyleSheet,
  Linking,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
interface Link {
  header?: string;
  url: string;
}

interface Topic {
  id: string;
  name: string;
  links: string[];
  image: string | number; // Updated to accept number for require()
}

const App: React.FC = () => {
  const defaultTopics: Topic[] = [
    { id: '1', name: 'HTML', links: ['https://developer.mozilla.org/en-US/docs/Web/HTML','https://www.w3schools.com/html/','https://www.codecademy.com/learn/learn-html',], image: require('../../assets/images/html.png') },
    { id: '2', name: 'CSS', links: ['https://developer.mozilla.org/en-US/docs/Web/CSS'], image: require('../../assets/images/css.png') },
    { id: '3', name: 'JavaScript', links: ['https://developer.mozilla.org/en-US/docs/Web/JavaScript'], image: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png' },
    { id: '4', name: 'React', links: ['https://reactjs.org/docs/getting-started.html'], image: require('../../assets/images/react-logo.png') },
    { id: '5', name: 'React Native', links: ['https://reactnative.dev/docs/getting-started'], image: require('../../assets/images/react-logo.png') },
    { 
      id: '6', 
      name: 'Data Structures & Algorithms', 
      links: [
        'https://www.geeksforgeeks.org/data-structures/',
        'https://leetcode.com/study-plan/algorithm/'
      ], 
      image: require('../../assets/images/dsa.png') 
    },
    { 
      id: '7', 
      name: 'Artificial Intelligence & Machine Learning', 
      links: [
        'https://www.turing.com/kb/what-is-machine-learning',
        'https://towardsdatascience.com/introduction-to-artificial-intelligence-ai-and-machine-learning-ml-6df4fc07b64b'
      ], 
      image: require('../../assets/images/ai_ml.png') 
    },
    
    { 
      id: '8', 
      name: 'Blockchain & Cryptocurrencies', 
      links: [
        'https://www.ibm.com/topics/what-is-blockchain',
        'https://www.coindesk.com/learn/what-is-bitcoin'
      ], 
      image: require('../../assets/images/blockchain.jpg') 
    },
    
    { 
      id: '9', 
      name: 'Cloud Computing & DevOps', 
      links: [
        'https://azure.microsoft.com/en-us/overview/what-is-cloud-computing/',
        'https://www.redhat.com/en/topics/devops/what-is-devops'
      ], 
      image: require('../../assets/images/cloud_devops.png') 
    },
    
    { 
      id: '10', 
      name: 'Cybersecurity & Ethical Hacking', 
      links: [
        'https://www.coursera.org/articles/ethical-hacking',
        'https://www.cybrary.it/skill-certification/ethical-hacking/'
      ], 
      image: require('../../assets/images/cybersecurity.png') 
    }
  ];

  const [topics, setTopics] = useState<Topic[]>(defaultTopics);
  const [newLink, setNewLink] = useState('');
  const [newLinkHeader, setNewLinkHeader] = useState('');
  const [newImage, setNewImage] = useState(''); // New state for image URL
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [loading, setLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [searchQuery, setSearchQuery] = useState('');
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicLinks, setNewTopicLinks] = useState<string[]>([]);
  const [addLinkModalVisible, setAddLinkModalVisible] = useState(false);
  const [newTopicImage, setNewTopicImage] = useState('');

  useEffect(() => {
const loadTopics = async () => {
  try {
    const savedTopics = await AsyncStorage.getItem('topics');
    console.log('Saved Topics:', savedTopics);
    if (savedTopics) {
      const parsedTopics = JSON.parse(savedTopics);
      console.log('Parsed Topics:', parsedTopics);
      setTopics(parsedTopics);
    }
  } catch (error) {
    console.error('Error loading topics:', error);
  }
};

    loadTopics();

    setTimeout(() => {
      setLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 1500);
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('topics', JSON.stringify(topics)).catch((error) =>
      console.error('Error saving topics:', error)
    );
  }, [topics]);

  const addLink = () => {
    if (newLink && selectedTopic) {
      const formattedLink = newLinkHeader 
      ? `${newLinkHeader}: ${newLink}` 
      : newLink;
      const updatedTopics = topics.map((topic) =>
        topic.id === selectedTopic.id ? { ...topic, links: [...topic.links, formattedLink], image: newImage || topic.image } : topic
      );
      
      setTopics(updatedTopics);
      setSelectedTopic({ 
        ...selectedTopic, 
        links: [...selectedTopic.links, formattedLink], 
        image: newImage || selectedTopic.image 
      });
      setNewLink('');
      setNewImage('');
      setAddLinkModalVisible(false);
    }
  };
  const addNewTopic = () => {
    if (newTopicName && newTopicLinks.length > 0) {
      const newTopic: Topic = {
        id: (topics.length + 1).toString(),
        name: newTopicName,
        links: newTopicLinks,
        image: newTopicImage || 'https://via.placeholder.com/80',
      };
      setTopics((prevTopics) => [...prevTopics, newTopic]);
      setNewTopicName('');
      setNewTopicLinks([]);
      setNewTopicImage('');
      Alert.alert('Topic Added', `${newTopicName} has been added successfully.`);
    } else {
      Alert.alert('Error', 'Please enter a valid topic name and at least one link.');
    }
  };

  const handleLinkClick = (link: string) => {
    if (link) {
      Linking.openURL(link).catch((err) => console.error('Failed to open URL:', err));
    }
  };

  const toggleTheme = () => setIsDarkTheme((prev) => !prev);

  const filteredTopics = topics.filter((topic) =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={[styles.container, isDarkTheme ? styles.darkContainer : styles.lightContainer]}>
        <Animated.View style={[styles.loadingScreen, { opacity: fadeAnim }]}>
          <Text style={[styles.loadingText, isDarkTheme ? styles.darkText : styles.lightText]}>Loading...</Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, isDarkTheme ? styles.darkContainer : styles.lightContainer]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.contentContainer}>
        <ScrollView contentContainerStyle={styles.scrollViewContent} style={{ flex: 1, width: '100%' }}>

          <Text style={[styles.header, isDarkTheme ? styles.darkText : styles.lightText]}>Tech Topics</Text>

          <View style={styles.searchAndThemeContainer}>
            <TextInput
              style={[styles.searchBar, isDarkTheme ? styles.darkSearchBar : null]}
              placeholder="Search topics..."
              placeholderTextColor={isDarkTheme ? '#aaa' : '#555'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity onPress={toggleTheme} style={styles.themeToggleButton}>
              <Icon name={isDarkTheme ? 'moon' : 'sunny'} size={30} color={isDarkTheme ? '#fff' : '#000'} />
            </TouchableOpacity>
          </View>

          {modalVisible && (
            <View style={styles.addTopicContainer}>
              <TextInput
                style={[styles.input, isDarkTheme ? styles.darkInput : styles.lightInput]}
                placeholder="Enter new topic name..."
                placeholderTextColor={isDarkTheme ? '#ccc' : '#888'}
                value={newTopicName}
                onChangeText={setNewTopicName}
              />
              <TextInput
                style={[styles.input, isDarkTheme ? styles.darkInput : styles.lightInput]}
                placeholder="Enter links for the topic (comma-separated)..."
                placeholderTextColor={isDarkTheme ? '#ccc' : '#888'}
                value={newTopicLinks.join(', ')}
                onChangeText={(text) => setNewTopicLinks(text.split(',').map(link => link.trim()))}
              />
              <TextInput
                style={[styles.input, isDarkTheme ? styles.darkInput : styles.lightInput]}
                placeholder="Enter image URL for the topic..."
                placeholderTextColor={isDarkTheme ? '#ccc' : '#888'}
                value={newTopicImage}
                onChangeText={setNewTopicImage}
              />
              <Button title="Add Topic" onPress={addNewTopic} />
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}


          <View style={styles.genresContainer}>
            {filteredTopics.map((topic) => (
              <View key={topic.id} style={styles.topicContainer}>
                <TouchableOpacity
                  onPress={() => setSelectedTopic(topic)}
                  style={styles.topicButton}
                  activeOpacity={0.7}
                >
                  <Image source={typeof topic.image === 'string' ? { uri: topic.image } : topic.image} style={styles.topicImage} />
                  <Text style={[styles.topicName, isDarkTheme ? styles.darkText : styles.lightText]}>{topic.name}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {selectedTopic && (
            <Modal visible={true} animationType="slide">
              <View style={[styles.modalContainer, isDarkTheme ? styles.darkContainer : styles.lightContainer]}>
                <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedTopic(null)}>
                  <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>
                <Text style={[styles.header, isDarkTheme ? styles.darkText : styles.lightText]}>{selectedTopic.name}</Text>
                <View style={styles.linksContainer}>
  {selectedTopic.links.map((link, index) => {
    const [header, url] = link.includes(': ') ? link.split(': ') : ['', link];
    return (
      <View key={index} style={styles.linkItem}>
        {header ? <Text style={styles.linkHeader}>{header}</Text> : null}
        <TouchableOpacity onPress={() => handleLinkClick(url)} style={styles.linkButton}>
          <Text style={[styles.linkText, { color: isDarkTheme ? 'white' : 'black' }]}>{url}</Text>
        </TouchableOpacity>
      </View>
    );
  })}
</View>


                <TouchableOpacity onPress={() => setAddLinkModalVisible(true)} style={styles.addLinkButton}>
                  <Text style={[styles.addLinkText, isDarkTheme ? styles.darkText : styles.lightText]}>+ Add New Link</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          )}

          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addLinkButton}>
            <Text style={[styles.addLinkText, isDarkTheme ? styles.darkText : styles.lightText]}>+ Add New Topic</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <Modal visible={addLinkModalVisible} animationType="slide" transparent={true}>
  <View style={styles.modalOverlay}>
    <View style={[styles.modalContent, isDarkTheme ? styles.darkContainer : styles.lightContainer]}>
      <TextInput
        style={[styles.input, isDarkTheme ? styles.darkInput : styles.lightInput]}
        placeholder="Link header (optional)..."
        placeholderTextColor={isDarkTheme ? '#ccc' : '#888'}
        value={newLinkHeader}
        onChangeText={setNewLinkHeader}
      />
      <TextInput
        style={[styles.input, isDarkTheme ? styles.darkInput : styles.lightInput]}
        placeholder="Enter new link..."
        placeholderTextColor={isDarkTheme ? '#ccc' : '#888'}
        value={newLink}
        onChangeText={setNewLink}
      />
      <Button title="Add Link" onPress={addLink} />
      <TouchableOpacity onPress={() => setAddLinkModalVisible(false)} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  linkItem: {
    marginBottom: 15,
  },
  linkHeader: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#555', // Customize this color as per your theme
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  lightContainer: {
    backgroundColor: '#f0f0f0',
  },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 10,
    paddingBottom: 20,
    width: '100%',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 15,
    marginTop: 40,
  },
  darkText: {
    color: '#fff',
  },
  lightText: {
    color: '#000',
  },
  searchAndThemeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  darkSearchBar: {
    backgroundColor: '#333',
    color: '#fff',
  },
  themeToggleButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  addLinkButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  addLinkText: {
    fontSize: 18,
    color: '#fff',
  },
  addTopicContainer: {
    padding: 20,
    borderRadius: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  darkInput: {
    backgroundColor: '#333',
    color: '#fff',
  },
  lightInput: {
    backgroundColor: '#fff',
    color: '#000',
  },
  closeButton: {
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: '#FF6347',
    borderRadius: 5,
  },
  closeButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    padding: 10,
  },
  topicContainer: {
    width: '30%',
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
  },
  topicButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
  },
  topicImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  topicName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  linksContainer: {
    marginTop: 20,
  },
  linkButton: {
    padding: 10,
    marginBottom: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    width: '80%',
    backgroundColor: '#fff',
  },
  linkText: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default App;
