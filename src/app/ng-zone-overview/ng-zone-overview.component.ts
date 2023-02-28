import {AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {fromEvent} from 'rxjs';

@Component({
  templateUrl: './ng-zone-overview.component.html',
  styleUrls: ['./ng-zone-overview.component.scss']
})
export class NgZoneOverviewComponent implements OnInit, AfterViewInit {
  count1 = 0;
  count2 = 0;
  timerId?: number;
  enableSetInterval = false;

  @ViewChild('btnIncrease') btnIncrease!: ElementRef<HTMLButtonElement>;
  @ViewChild('btnMinus') btnMinus!: ElementRef<HTMLButtonElement>;

  constructor(private ngZone: NgZone) {
  }

  ngOnInit(): void {
    // this.ngZone.runOutsideAngular(() => {
    //   document.querySelectorAll('.button-2').forEach((ele) => {
    //     ele.addEventListener('click', (e) => {
    //       e.target! as H
    //       this.count2 += +(e.target as HTMLButtonElement).dataset.value;
    //       console.log('this.count2=', this.count2);
    //     });
    //   });
    // });
    //
    // setInterval(() => {
    // }, 5000);
  }

  increase1(num: number): void {
    // browser event, will trigger CD
    this.count1 = this.count1 + num;
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.btnIncrease.nativeElement.addEventListener('click', () => {
        this.count2 += 1;
        console.log('this.count2 = ', this.count2);
      });

      fromEvent(this.btnMinus.nativeElement, 'click').subscribe(() => {
        this.count2 -= 1;
        console.log('this.count2 = ', this.count2);
      });
    });
  }

  toggleSetInterval(): void {
    this.enableSetInterval = !this.enableSetInterval;
    if (this.enableSetInterval) {
      console.log('enable setInterval');
      this.timerId = window.setInterval(() => {
        // do nothing, but will trigger change detect in angular (so magic, is it)
        console.log('enter setInterval');
      }, 5000);
    } else {
      console.log('disable setInterval');
      window.clearInterval(this.timerId);
    }
  }
}
