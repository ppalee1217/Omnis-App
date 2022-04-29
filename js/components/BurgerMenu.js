import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, Button } from 'react-native';
import { FloatingMenu } from 'react-native-floating-action-menu';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faTimes, faUserPlus } from '@fortawesome/free-solid-svg-icons';

const items = [
  { 
    label: 'Do a little dance', 
    fa: faBars,
  },
  { 
    label: 'Make a lil love',
    image: require('../../res/images/co2.png')
  },
  { label: 'Get down tonight' },
];

class MyScreen extends React.Component {
  state = {
    isMenuOpen: false,
  };

  handleMenuToggle = isMenuOpen =>
    this.setState({ isMenuOpen });

  handleItemPress = (item, index) =>
    console.log('pressed item', item);

  renderItemIcon = (item, index, menuState) => {
    const { itemsDown, dimmerActive } = menuState;

    const isItemPressed = itemsDown[index];
    const color = isItemPressed ? '#fff' : primaryColor;
    // Icons can be rendered however you like.
    // Here are some examples, using data from the item object:

    if (item.fa) {
      return (
        <FontAwesomeIcon
          icon={faTimes}
          size={50}
          color={'#e9faff'}
        />
      );
    }
    else if (item.image) {
      return (
        <Image
          source={item.image}
          style={{ tintColor: color }}
        />
      );
    }

    return null;
  };

  render() {
    return (
      <View style={styles.container}>
        <FloatingMenu
          position={'top-left'}
          isOpen={this.state.isMenuOpen}
          items={items}
          onMenuToggle={this.handleMenuToggle}
          onItemPress={this.handleItemPress}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
});

export default MyScreen;
