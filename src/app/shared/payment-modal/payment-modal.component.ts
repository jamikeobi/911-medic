import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaymentResult } from 'src/app/core/models/payment/PaymentResult';
import { PaystackService } from 'src/app/core/services/paystack/paystack.service';

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.css'],
})
export class PaymentModalComponent {
  @Input() email = '';
  @Input() amount = 0;
  @Input() description = 'Consultation Payment';
  @Output() paymentSuccess = new EventEmitter<PaymentResult>();
  @Output() paymentClosed = new EventEmitter<void>();

  isProcessing = false;
  isSuccess = false;
  reference = '';

  constructor(private paystackService: PaystackService) {}

  initiatePayment(): void {
    this.isProcessing = true;
    this.reference = `911MEDIC-${Date.now()}`;

    this.paystackService.initiatePayment(
      this.email,
      this.amount,
      this.reference,
      (response) => this.onSuccess(response),
      () => this.onClose(),
    );
  }

  private onSuccess(response: any): void {
    this.isProcessing = false;
    this.isSuccess = true;
    this.paymentSuccess.emit({
      success: true,
      reference: response.reference,
      amount: this.amount,
    });
  }

  private onClose(): void {
    this.isProcessing = false;
    this.paymentClosed.emit();
  }

  reset(): void {
    this.isSuccess = false;
    this.isProcessing = false;
    this.reference = '';
  }
}
