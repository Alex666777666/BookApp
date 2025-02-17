import React, {createContext, useState, ReactNode} from 'react';

export interface BookItem {
  id: string;
  title: string;
  cover_url?: string;
  genre?: string;
  author?: string;
  likes?: string;
  quotes?: string;
  summary?: string;
  views?: string;
  recommendedBooks?: Array<{id: string; title: string; cover_url?: string}>;
}

interface BooksContextValue {
  books: BookItem[];
  setBooks: React.Dispatch<React.SetStateAction<BookItem[]>>;
}

export const BooksContext = createContext<BooksContextValue>({
  books: [],
  setBooks: () => {},
});

export const BooksProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [books, setBooks] = useState<BookItem[]>([]);

  return (
    <BooksContext.Provider value={{books, setBooks}}>
      {children}
    </BooksContext.Provider>
  );
};
