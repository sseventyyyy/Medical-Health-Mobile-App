export interface Doctor {
  id: string;
  fullName: string;
  specialty: string;
  experienceYears: number;
  rating: number; // 0..5
  price: number; // тг за приём
  clinic: string;
  photoUrl?: string;
}