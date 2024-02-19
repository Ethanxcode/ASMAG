import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  setItem(key: string, value: unknown): void {
    const oldItem = localStorage.getItem(key);
    const oldItemParsed = oldItem ? JSON.parse(oldItem) : [];
    const newItem = Array.isArray(oldItemParsed)
      ? [...oldItemParsed, value]
      : [value];

    localStorage.setItem(key, JSON.stringify(newItem));
  }

  getItem(key: string): unknown {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
}
