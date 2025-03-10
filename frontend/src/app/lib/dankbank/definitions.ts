export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
  };
  
  export type CategoryData = {
    [key: string]: string | number;
  }
  
  export type Item = {
    id: string;
    category: string;
    name: string;
    review: string;
    rating: number;
    category_data: CategoryData;
  }
  
  export type Dining = {
    id: string;
    item: string;
    address: string;
    location: string;
    gmap_url: string;
    website: string;
    price_range: string;
    cuisine: string;
  }
  
  export type Food = {
    id: string;
    item: string;
    location: string;
    cost: number;
    cuisine: string;
  }
  
  export type Media = {
    id: string;
    item: string;
    source: string;
    artist: string;
    genre: string;
    website: string;
  }
  
  export type Travel = {
    id: string;
    item: string;
    location: string;
    address: string;
    gmap_url: string;
    website: string;
  }
  
  export type Image = {
    id: string;
    file: File;
    name: string;
    description: string;
  }
  
  export type ItemTable = {
    id: string;
    category: string;
    name: string;
    review: string;
    rating: number;
  };
  
  export type FormattedItemTable = {
    id: string;
    category: string;
    name: string;
    review: string;
    rating: number;
  };
  
  
  export type ItemForm = {
    id: string;
    category: string;
    name: string;
    review: string;
    rating: number;
  };
  