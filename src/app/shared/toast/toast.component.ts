import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';

declare var bootstrap: any;

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent implements AfterViewInit, OnDestroy {
  @ViewChild('toastElem') toastElem!: ElementRef;
  toast: any;
  message: string = 'Default message';

  ngAfterViewInit() {
    this.toast = new bootstrap.Toast(this.toastElem.nativeElement);
  }

  showToast(message: string) {
    this.message = message;
    this.toast.show();
  }

  hideToast() {
    this.toast.hide();
  }

  ngOnDestroy() {
    this.toast.dispose();
  }
}
