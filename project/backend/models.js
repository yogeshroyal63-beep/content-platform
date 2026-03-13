const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false,
});

// User Model
const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  username: { type: DataTypes.STRING(50), allowNull: false, unique: true, validate: { len: [3, 50] } },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

// Content Model
const Content = sequelize.define('Content', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING(200), allowNull: false, validate: { len: [1, 200] } },
  body: { type: DataTypes.TEXT, allowNull: false },
  category: {
    type: DataTypes.ENUM('article', 'tutorial', 'news', 'review', 'other'),
    defaultValue: 'article',
  },
  tags: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const raw = this.getDataValue('tags');
      try { return JSON.parse(raw); } catch { return []; }
    },
    set(val) {
      this.setDataValue('tags', JSON.stringify(Array.isArray(val) ? val : []));
    },
  },
  status: { type: DataTypes.ENUM('draft', 'published', 'archived'), defaultValue: 'published' },
  views: { type: DataTypes.INTEGER, defaultValue: 0 },
  authorId: { type: DataTypes.UUID, allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

// Associations
User.hasMany(Content, { foreignKey: 'authorId', as: 'contents' });
Content.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

module.exports = { sequelize, User, Content };
