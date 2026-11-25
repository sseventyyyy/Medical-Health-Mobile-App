import { Tab } from '../profile/components/BottomTabBar';
import { BookingDraft } from './store';

export interface MainNav {
  openTab: (tab: Tab) => void;
  back: () => void;
  openNotifications: () => void;
  openSettings: () => void;
  openDoctors: (favoritesOnly?: boolean) => void;
  openDoctor: (doctorId: string) => void;
  openChat: (doctorId: string) => void;
  openBooking: (doctorId: string, day?: number) => void;
  openPayment: (draft: BookingDraft) => void;
  finishPayment: (appointmentId: string) => void;
  openPaymentMethod: () => void;
  openAppointment: (appointmentId: string) => void;
  openCancel: (appointmentId: string) => void;
  openReview: (appointmentId: string) => void;
}
