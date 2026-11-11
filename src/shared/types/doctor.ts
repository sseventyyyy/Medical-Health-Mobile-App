export interface Doctor {
  id: string;
  fullName: string;
  specialty: string;
  experienceYears: number;
  rating: number;
  price: number;
  clinic: string;
  photoUrl?: string;
}
