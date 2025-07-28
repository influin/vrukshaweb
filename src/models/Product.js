// src/models/Product.js

class Product {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.images = data.images || [];
    this.category = data.category;
    this.description = data.description || '';
    this.variations = data.variations || [];
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static fromJson(json) {
    return new Product(json);
  }

  getDefaultPrice() {
    if (this.variations && this.variations.length > 0) {
      return this.variations[0].price;
    }
    return 0;
  }

  getDefaultQuantity() {
    if (this.variations && this.variations.length > 0) {
      return this.variations[0].quantity;
    }
    return '';
  }

  getImageUrl() {
    if (this.images && this.images.length > 0) {
      return this.images[0];
    }
    return 'https://via.placeholder.com/150';
  }
}

export default Product;