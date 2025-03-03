export type Item = {
    id: string;
    category: 'Dining' | 'Food' | 'Music' | 'Travel'; //enum?
    name: string;
    review: string;
    rating: number;
}