import { Book } from './Book';

export interface BookForAdmin extends Book{
    IsVisible: boolean;
}