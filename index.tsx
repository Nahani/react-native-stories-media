import React, { useRef, useState, useEffect } from "react";
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar
} from "react-native";
import { StoryType } from "./src";

import { CubeNavigationHorizontal } from 'react-native-3dcube-navigation';

import StoryContainer from "./src/StoryContainer";

type Props = {
  data: StoryType[];
  containerAvatarStyle?: StyleSheet.Styles;
  avatarStyle?: StyleSheet.Styles;
  titleStyle?: StyleSheet.Styles;
  textReadMore?: string;
};

const Stories = (props: Props) => {
  const [isModelOpen, setModel] = useState(false);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentScrollValue, setCurrentScrollValue] = useState(0);
  const modalScroll = useRef(null);

  const onStorySelect = (index) => {
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor('black');
    setCurrentUserIndex(index);
    setModel(true);
  };

  const onStoryClose = () => {
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor('rgba(255, 255, 255,0.6)');
    setModel(false);
  };

  const onStoryNext = (isScroll: boolean) => {
    const newIndex = currentUserIndex + 1;
    if (props.data.length - 1 > currentUserIndex) {
      setCurrentUserIndex(newIndex);
      if (!isScroll) {
        //erro aqui
        try {
          modalScroll.current.scrollTo(newIndex, true);
        } catch (e) {
          console.warn("error=>", e);
        }
      }
    } else {
      setModel(false);
    }
  };

  const onStoryPrevious = (isScroll: boolean) => {
    const newIndex = currentUserIndex - 1;
    if (currentUserIndex > 0) {
      setCurrentUserIndex(newIndex);
      if (!isScroll) {
        modalScroll.current.scrollTo(newIndex, true);
      }
    }
  };

  const onScrollChange = (scrollValue) => {
    if (currentScrollValue > scrollValue) {
      onStoryNext(true);
      console.log("next");
      setCurrentScrollValue(scrollValue);
    }
    if (currentScrollValue < scrollValue) {
      onStoryPrevious(false);
      console.log("previous");
      setCurrentScrollValue(scrollValue);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={props.data}
        //horizontal
        ListFooterComponent={<View style={{ height: 100}}/>}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.title}
        renderItem={({ item, index }) => (
          <View style={styles.boxStory}>
            <TouchableOpacity onPress={() => onStorySelect(index)}>
              <View style={[styles.superCircle, props.containerAvatarStyle]}>
                <Image
                  style={[styles.circle, props.avatarStyle]}
                  source={{ uri: item.profile }}
                />
              </View>

              {/* <Text style={[styles.title, props.titleStyle]}>{item.title}</Text> */}
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal
        animationType="slide"
        transparent={false}
        visible={isModelOpen}
        style={styles.modal}
        onShow={() => {
          if (currentUserIndex > 0) {
            modalScroll.current.scrollTo(currentUserIndex, false);
          }
        }}
        onRequestClose={onStoryClose}
      >
        <CubeNavigationHorizontal
          callBackAfterSwipe={(g) => onScrollChange(g)}
          ref={modalScroll}
          style={styles.container}
        >
          {props.data.map((item, index) => (
            <StoryContainer
              key={item.title}
              onClose={onStoryClose}
              onStoryNext={onStoryNext}
              onStoryPrevious={onStoryPrevious}
              dataStories={item}
              isNewStory={index !== currentUserIndex}
              textReadMore={props.textReadMore}
            />
          ))}
        </CubeNavigationHorizontal>
      </Modal>
    </View>
  );
};

const styles = new StyleSheet.create({
  boxStory: {
    marginHorizontal: 5,
    maxWidth: '50%',
    flex: 1
  },
  ItemSeparator: { height: 1, backgroundColor: "#ccc" },
  circle: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#FFF",
  },
  superCircle: {
    // borderWidth: 3,
    // borderColor: "blue",
    // borderRadius: 10,
  },
  modal: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    textAlign: "center",
  },
  row: {
    flex: 1,
    justifyContent: "space-around",
    marginBottom: 5,
  }
});

export default Stories;
