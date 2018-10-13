import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchDecks, removeDeck } from '../utils/api';
import { receiveDecks, deleteDeck } from '../actions';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Platform,
  TouchableHighlight,
} from 'react-native';
import Swipeout from 'react-native-swipeout';
import {
  white,
  orange,
  darkGray,
  lightBlue,
  gray,
  mediumGray,
  gainsbroGray,
  indianRed,
} from '../utils/colors';

function Deck({ title, questions }) {
  return (
    <View style={styles.item} key={title}>
      <Text style={{ fontSize: 20, color: mediumGray, fontWeight: 'bold' }}>
        {title}
      </Text>
      <Text style={{ color: gainsbroGray }}>{questions && questions.length} cards</Text>
    </View>
  );
}

class Decks extends Component {
  state = {
    ready: false,
    testItem: {}
  };

  componentDidMount() {
    const { dispatch, decks } = this.props;
    fetchDecks()
      .then(decks => dispatch(receiveDecks(decks)))
      .then(() => this.setState(() => ({ready: true})));
  }

  deleteDeck = (item) => {
    //this.props.dispatch(deleteDeck(item)); 
    //removeDeck(item.title);
  }

  renderItem = ({ item }, key) => {
    let swipeBtns = [{
      text: 'Delete',
      backgroundColor: indianRed,
      underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
      onPress: () => { this.deleteDeck(item) }
    }];

    return (
      <Swipeout right={swipeBtns}
        autoClose='true'
        backgroundColor= 'transparent'>
        <TouchableHighlight
          underlayColor={lightBlue}
          onPress={() =>
            this.props.navigation.navigate('DeckDetail', { deckId: item.title })
          }>
          <Deck key={item.title} title={item.title} questions={item.questions} />
        </TouchableHighlight>
      </Swipeout>
    );
  };

  render() {
    const { decks } = this.props;
    const { ready } = this.state

    const arrOfDecks = [];
    decks !== undefined &&
      Object.keys(decks).map(key => {
        arrOfDecks.push(decks[key]);
      });

    return (
      <View style={{ flex: 1 }}>
         {(ready && arrOfDecks.length > 0) && 
          <FlatList data={arrOfDecks} renderItem={this.renderItem} />
         }
         {(!ready || arrOfDecks.length === 0) &&
          <View style={{flex:1, justifyContent:'center', alignContent:'center'}}>
            <Text style={{fontSize:26, textAlign:'center', color:mediumGray, fontWeight:'bold'}}>Click on Tab "Add Deck", to Create a New Quiz!</Text>
          </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: white,
    padding: 20,
    marginBottom: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});

function mapStateToProps(decks) {
  return {
    decks,
  };
}

export default connect(mapStateToProps)(Decks);
