import {BookItem} from '../components/Library/HorisontalFlatList';

export interface SlideItem {
  id: string;
  title: string;
  source: {uri: string} | number;
}

export type RootStackParamList = {
  Library: undefined;
  Detail: {
    book?: BookItem;
    slide?: SlideItem;
  };
};
