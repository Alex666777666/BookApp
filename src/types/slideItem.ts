export interface SlideApiResponse {
  id: number;
  book_id: string;
  cover: string;
}

export interface SlideItem extends Omit<SlideApiResponse, 'id' | 'cover'> {
  id: string;
  title: string;
  source: {uri: string};
}
