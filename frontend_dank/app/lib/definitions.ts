// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Item = {
  id: string;
  category: '' | 'Dining' | 'Food' | 'Music' | 'Travel'; //enum?
  name: string;
  review: string;
  rating: number;
  address: string;
  location: string;
  gmap_url: string;
  item_url: string;
  price_range: '' | '$' | '$$' | '$$$' | '$$$$' | '$$$$$';
  cost: number;
  cuisine: string;
  music_source: '' | 'SoundCloud' | 'Spotify' | 'YouTube';
  artist: string;
  music_meta: string;
}

export type ItemTable = {
  id: string;
  category: 'Dining' | 'Food' | 'Music' | 'Travel'; //enum?
  name: string;
  review: string;
  rating: number;
};

export type FormattedItemTable = {
  id: string;
  category: 'Dining' | 'Food' | 'Music' | 'Travel'; //enum?
  name: string;
  review: string;
  rating: number;
};


export type ItemForm = {
  id: string;
  category: 'Dining' | 'Food' | 'Music' | 'Travel'; //enum?
  name: string;
  review: string;
  rating: number;
};
