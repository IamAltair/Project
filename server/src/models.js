// @flow

import Sequelize from 'sequelize';
import type { Model } from 'sequelize';

let sequelize = new Sequelize('School', 'root', '', {
    host: process.env.CI ? 'mysql' : 'localhost', // The host is 'mysql' when running in gitlab CI
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

export let Cases: Class<
  Model<{ id?: number, title: string, text: string, img: string, category: number, importance: number}>
> = sequelize.define('Cases', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  title: Sequelize.STRING,
  text: Sequelize.STRING,
  img: Sequelize.STRING,
    category: Sequelize.INTEGER,
    importance: Sequelize.INTEGER
});

// Drop tables and create test data when not in production environment
let production = process.env.NODE_ENV === 'production';
// The sync promise can be used to wait for the database to be ready (for instance in your tests)
export let sync = sequelize.sync({ force: production ? false : true }).then(() => {
  if (!production)
    return Cases.create({
      title: 'Test',
      text: 'tons of content',
      img: 'https://i.imgur.com/vSD5rT8.gif',
        category: 1,
        importance: 1,
    }).then(() =>
      Cases.create({
          title: 'Test2',
          text: 'even more content',
          img: 'http://s1.bwallpapers.com/wallpapers/2014/01/29/snow-cat_045842554.jpg',
          category: 2,
          importance: 2,
      })
    );
});
