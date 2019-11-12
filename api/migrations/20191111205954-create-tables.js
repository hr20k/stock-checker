'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  db.runSql(
    'CREATE TABLE users (\
      id int(11) UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,\
      username varchar(64) NOT NULL,\
      password varchar(64) NOT NULL,\
      create_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,\
      update_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\
      delete_at timestamp NULL DEFAULT NULL,\
      UNIQUE(username)\
    );'
  );
  db.runSql(
    'CREATE TABLE items (\
      id int(11) UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,\
      user_id int(11) UNSIGNED NOT NULL,\
      name varchar(64) NOT NULL,\
      model_number varchar(64) NULL,\
      quantity int(11) NOT NULL DEFAULT 0,\
      image_url varchar(128) NULL,\
      notes text NULL,\
      create_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,\
      update_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\
      delete_at timestamp NULL DEFAULT NULL,\
      UNIQUE(user_id, name)\
    );'
  );
  db.runSql(
    'CREATE TABLE tags (\
      id int(11) UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,\
      user_id int(11) UNSIGNED NOT NULL,\
      name varchar(64) NOT NULL,\
      color varchar(8) NOT NULL,\
      create_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,\
      update_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\
      UNIQUE(user_id, name)\
    );'
  );
  db.runSql(
    'CREATE TABLE item_tag (\
      id int(11) UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,\
      item_id int(11) UNSIGNED NOT NULL,\
      tag_id int(11) UNSIGNED NOT NULL,\
      create_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,\
      update_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\
      delete_at timestamp NULL DEFAULT NULL,\
      UNIQUE(item_id, tag_id)\
    );'
  );
  // db.createTable('users', {
  //   id: {
  //     type: 'int',
  //     length: 11,
  //     unsigned: true,
  //     notNull: true,
  //     primaryKey: true,
  //     autoIncrement: true
  //   },
  //   username: {
  //     type: 'string',
  //     length: 64,
  //     notNull: true,
  //     unique: true
  //   },
  //   password: {
  //     type: 'string',
  //     length: 64,
  //     notNull: true
  //   }
  // });

  // db.createTable('items', {
  //   id: {
  //     type: 'int',
  //     length: 11,
  //     unsigned: true,
  //     notNull: true,
  //     primaryKey: true,
  //     autoIncrement: true
  //   },
  //   user_id: {
  //     type: 'int',
  //     length: 11,
  //     unsigned: true,
  //     notNull: true,
  //     unique: true
  //   },
  //   name: {
  //     type: 'string',
  //     length: 64,
  //     notNull: true,
  //     unique: true
  //   },
  //   model_number: {
  //     type: 'string',
  //     length: 64,
  //     defaultValue: null
  //   },
  //   quantity: {
  //     type: 'int',
  //     length: 11,
  //     notNull: true,
  //     defaultValue: 0
  //   },
  //   image_url: {
  //     type: 'string'
  //   },
  //   notes: {
  //     type: 'string'
  //   }
  // });

  // db.createTable('tags', {
  //   id: {
  //     type: 'int',
  //     length: 11,
  //     unsigned: true,
  //     notNull: true,
  //     primaryKey: true,
  //     autoIncrement: true
  //   },
  //   user_id: {
  //     type: 'int',
  //     length: 11,
  //     unsigned: true,
  //     notNull: true,
  //     unique: true
  //   },
  //   name: {
  //     type: 'string',
  //     length: 64,
  //     notNull: true,
  //     unique: true
  //   },
  //   color: {
  //     type: 'string',
  //     length: 8,
  //     notNull: true
  //   }
  // });

  // db.createTable('item_tag', {
  //   id: {
  //     type: 'int',
  //     length: 11,
  //     unsigned: true,
  //     notNull: true,
  //     primaryKey: true,
  //     autoIncrement: true
  //   },
  //   item_id: {
  //     type: 'int',
  //     length: 11,
  //     unsigned: true,
  //     notNull: true,
  //     unique: true
  //   },
  //   tag_id: {
  //     type: 'int',
  //     length: 11,
  //     unsigned: true,
  //     notNull: true,
  //     unique: true
  //   }
  // });

  return null;
};

exports.down = function(db) {
  db.dropTable('users');
  db.dropTable('items');
  db.dropTable('tags');
  db.dropTable('item_tag');
  return null;
};

exports._meta = {
  "version": 1
};
