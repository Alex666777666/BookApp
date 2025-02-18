import React, {createContext, useState, ReactNode} from 'react';
import {BookItem} from '../types/bookItem';

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
