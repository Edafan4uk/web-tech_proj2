import { Book } from './Book';

export interface BookForAdmin extends Book{
    isVisible: boolean;
}