export interface BookApiResponse {
  id: string;
  name: string;
  cover_url: string;
  genre: string;
  author: string;
  likes: string;
  quotes: string;
  summary: string;
  views: string;
}

export interface BookItem extends Omit<BookApiResponse, 'name'> {
  title: string;
  recommendedBooks?: Array<{id: string; title: string; cover_url?: string}>;
}
