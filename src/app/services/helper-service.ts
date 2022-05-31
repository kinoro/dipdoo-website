import { Injectable } from '@angular/core';
import { Post } from '../models/post';

@Injectable({
    providedIn: 'root'
})
export class HelperService {

    constructor() {
    }

    buildFriendlyId(post: Post): string {
        const maxLength = 100;
        let titlePortion = post.title.toLocaleLowerCase().replace(/[^0-9a-zA-Z ]/gi, '').split(' ').join('-');
        titlePortion = titlePortion.length > maxLength ? titlePortion.substring(0, maxLength) : titlePortion;
        return `${titlePortion}-${post.id}`;
    }

    round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }

    copyToClipboard(text) {
        if (
          (window as any).clipboardData &&
          (window as any).clipboardData.setData
        ) {
          // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
          return (window as any).clipboardData.setData('Text', text);
        } else if (
          document.queryCommandSupported &&
          document.queryCommandSupported('copy')
        ) {
          var textarea = document.createElement('textarea');
          textarea.textContent = text;
          textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in Microsoft Edge.
          document.body.appendChild(textarea);
          textarea.select();
          try {
            return document.execCommand('copy'); // Security exception may be thrown by some browsers.
          } catch (ex) {
            console.warn('Copy to clipboard failed.', ex);
            return false;
          } finally {
            document.body.removeChild(textarea);
          }
        }
      }
    
      newGuid() {
        var _p8 = (s = null) => {
          var p = (Math.random().toString(16) + '000000000').substr(2, 8);
          return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
        };
        return _p8() + _p8(true) + _p8(true) + _p8();
      }
    
      addDays(date: Date, days: number): Date {
        var tempDate = new Date(date.valueOf());
        tempDate.setDate(tempDate.getDate() + days);
        return tempDate;
      }
    
      addMinutes(date: Date, minutes: number): Date {
        return new Date(date.getTime() + minutes * 60000);
      }
    
      toDayStart(date: Date): Date {
        var newDate = new Date(date.valueOf());
        newDate.setHours(0, 0, 0);
        newDate.setMilliseconds(0);
        return newDate;
      }
    
      toWeekStart(date: Date): Date {
        var newDate = new Date(date.valueOf());
        if (newDate.getDay() > 0) {
          newDate = this.addDays(newDate, -newDate.getDay());
        }
        return newDate;
      }
    
      formatTimeForDisplay(date: Date) {
        return (
          (date.getHours() < 10 ? '0' : '') +
          (date.getHours() > 12 ? date.getHours() - 12 : date.getHours()) +
          ':' +
          (date.getMinutes() < 10 ? '0' : '') +
          date.getMinutes() +
          ' ' +
          (date.getHours() < 12 ? 'AM' : 'PM')
        );
      }
    
      formatDateForDisplay(date: Date) {
        var options: any = {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        };
        return date.toLocaleDateString('en-GB', options);
      }
    
      formatPrice(pence: number, currencyCode?: string, showPence?: boolean) {
        currencyCode = currencyCode != null ? currencyCode : 'gbp';
        var formatter = new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: currencyCode.toUpperCase(),
          minimumFractionDigits:
            showPence == true ? 2 : showPence == false ? 0 : null,
        });
    
        return formatter.format(pence / 100);
      }
    
      /**
       * @description
       * Takes an Array<V>, and a grouping function,
       * and returns a Map of the array grouped by the grouping function.
       *
       * @param list An array of type V.
       * @param keyGetter A Function that takes the the Array type V as an input, and returns a value of type K.
       *                  K is generally intended to be a property key of V.
       *
       * @returns Map of the array grouped by the grouping function.
       */
      groupBy<K, V>(list: Array<V>, keyGetter: (input: V) => K): Map<K, Array<V>> {
        const map = new Map<K, Array<V>>();
        //groupBy(list, keyGetter) {
        //    const map = new Map();
        list.forEach((item) => {
          const key = keyGetter(item);
          const collection = map.get(key);
          if (!collection) {
            map.set(key, [item]);
          } else {
            collection.push(item);
          }
        });
        return map;
      }
    
      async pause(ms: number): Promise<void> {
        return new Promise<void>((resolve) => {
          const setTimeout = window['__zone_symbol__setTimeout'];
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
}
