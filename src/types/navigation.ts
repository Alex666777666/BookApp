import {BookItem} from './bookItem';
import {SlideItem} from './slideItem';

export type RootStackParamList = {
  Library: undefined;
  Detail: {
    book?: BookItem;
    slide?: SlideItem;
    sameGenreBooks?: BookItem[];
  };
};
