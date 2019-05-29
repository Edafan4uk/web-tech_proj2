import { HttpClient } from '@angular/common/http';
import { SortDirection } from '../../directives/sortable.directive';
import { PipeTransform } from '@angular/core';
import { BehaviorSubject, Subject, Observable, observable } from 'rxjs';
import { tap, debounceTime, switchMap, catchError } from 'rxjs/operators';

export interface SearchResult<T>{
  entities: T[];
  total: number;
}

export interface State{
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
}

export function compare(v1, v2){
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

export function sort<T>(entities: T[], column: string, direction: string): T[]{
  if(direction === ''){
    return entities;
  }
  else{
    return [...entities].sort((a,b)=>{
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    })
  }
}

export function matches<T extends object>(entity: T, term: string, propsPipes:{[key: string]: string},
   ...pipes:PipeTransform[]){
  let values:boolean[] = [];
  for(let item in entity){
    if(entity.hasOwnProperty(item) && (typeof(entity[item]) === 'string')){
      values.push(entity[item].toString().toLowerCase().includes(term))
    }
  }
  if(pipes.length){
    for(let pipe of pipes){
      for(let propPipe in propsPipes){
        if(propsPipes[propPipe] === pipe.constructor.name){
          values.push(pipe.transform(entity[propPipe]).includes(term));
        }
      }
    }
  }
  return values.reduce((prev,curr)=>{
    return prev || curr;
  }, false);
}

export abstract class AbstractService<T> {

  protected _loading$ = new BehaviorSubject<boolean>(true);
  protected _search$ = new Subject<void>();
  protected _entities$ = new BehaviorSubject<T[]>([]);
  protected _total$ = new BehaviorSubject<number>(0);

  protected _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };
  protected apiEntityUrl: string = '';
  protected methodName: string = '';
  
  constructor(protected http:HttpClient) {
      this._search$.pipe(
        tap(()=>this._loading$.next(true)),
        debounceTime(500),
        switchMap(()=>this._search().pipe(
          catchError(()=>{
            this._entities$.next([]);
            this._total$.next(0);
            return Observable.throw("");
          })
        )),
        tap(()=>this._loading$.next(false))
      ).subscribe((res:SearchResult<T>)=>{
        this._entities$.next(res.entities)
        this._total$.next(res.total);
      });

      this._search$.next();
   }

   get entities$() { return this._entities$.asObservable(); }
   get total$() { return this._total$.asObservable(); }
   get loading$() { return this._loading$.asObservable(); }
   get page() { return this._state.page; }
   get pageSize() { return this._state.pageSize; }
   get searchTerm() { return this._state.searchTerm; }

   set page(page: number) { this._set({page}); }
   set pageSize(pageSize: number) { this._set({pageSize}); }
   set searchTerm(searchTerm: string) { this._set({searchTerm}); }
   set sortColumn(sortColumn: string) { this._set({sortColumn}); }
   set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); } 
   
   protected _set(patch: Partial<State>){
     Object.assign(this._state, patch);
     this._search$.next();
   }

   protected _search<T>(): Observable<SearchResult<T>>{
     return this.http.get
     (`${this.apiEntityUrl}/${this.methodName}/?Page=${this._state.page}&PageSize=${this._state.pageSize}&SearchTerm=${this._state.searchTerm}&SortColumn=${this._state.sortColumn}&SortDirection=${this._state.sortDirection.toString()}`) as Observable<SearchResult<T>>;
   }
}
