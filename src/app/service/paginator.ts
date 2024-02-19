import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PaginatorService {
    private currentPage = new BehaviorSubject<number>(1);
    private itemsPerPage = new BehaviorSubject<number>(10);


    changePage(page: number) {
        this.currentPage.next(page);
    }

    changeItemsPerPage(items: number) {
        this.itemsPerPage.next(items);
    }
}