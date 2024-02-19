import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  public term: BehaviorSubject<string> = new BehaviorSubject('');
  private currentPage = new BehaviorSubject<number>(1);
  private totalRecords = new BehaviorSubject<number>(10);
  private itemsPerPage = new BehaviorSubject<number>(10);
  private category = new BehaviorSubject<string>('');

  category$ = this.category.asObservable();
  currentFilterTerm = this.term.asObservable();
  totalRecords$ = this.term.asObservable();
  currentPage$ = this.currentPage.asObservable();
  itemsPerPage$ = this.itemsPerPage.asObservable();

  getCategory(): BehaviorSubject<string> {
    return this.category;
  }

  changeCategory(category: string) {
    this.category.next(category);
  }

  getCurrentPage(): BehaviorSubject<number> {
    return this.currentPage;
  }

  getCurrentTotalRecords(): BehaviorSubject<number> {
    return this.totalRecords;
  }

  setCurrentTotalRecords(records: number): void {
    this.currentPage.next(records);
  }

  setCurrentPage(page: number): void {
    this.currentPage.next(page);
  }

  public getTerm(): BehaviorSubject<string> {
    return this.term;
  }

  changeFilterTerm(term: string) {
    this.term.next(term.toLowerCase());
  }

  changePage(page: number) {
    this.currentPage.next(page);
  }

  changeItemsPerPage(items: number) {
    this.itemsPerPage.next(items);
  }

  getDebouncedFilterTerm() {
    return this.term.pipe(debounceTime(500));
  }
}
