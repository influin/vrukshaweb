// src/models/Category.js

class Category {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.icon = data.icon || '';
    this.parent = data.parent;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static fromJson(json) {
    return new Category(json);
  }

  getIconUrl() {
    if (this.icon) {
      return this.icon;
    }
    return 'https://via.placeholder.com/50';
  }
}

export default Category;