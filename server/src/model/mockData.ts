import { Book } from './book';
import { Author } from './author';
import { Reader } from './reader';
import { EntityRelation } from './entityRelation';

export interface MockData {
  books: Book[];
  authors: Author[];
  readers: Reader[];
  book_author: EntityRelation[];
  reader_book: EntityRelation[];
}
