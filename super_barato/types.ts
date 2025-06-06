
export interface Supermarket {
    supermarket_id: string;
    name: string;
  }
  
  export interface Category {
    category_id: string;
    category: string;
    subcategory?: string;
  }
  
  export interface Product {
    ean: string;
    name: string;
    description: string;
    image_url: string;
    category_id: string;
  }
  
  export interface ProductPrice {
    ean: string;
    supermarket_id: string;
    price: number;
  }
  
  export interface CartItem {
    ean: string;
    quantity: number;
  }
  
  export interface ProductInCart extends Product {
    quantity: number;
  }
  
  export interface GroundingChunk {
    web?: {
      uri?: string;
      title?: string;
    };
    retrievedContext?: {
      uri?: string;
      title?: string;
    };
  }
  