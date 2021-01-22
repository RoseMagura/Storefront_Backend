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

exports.up = function(db, callback) {
  db.createTable('orders', {
      order_id: { type: 'int', primaryKey: true },
      numProducts: 'int',
      user_id: { type: 'int', notNull: true,
        foreignKey: {
            name: 'user_id',
            table: 'users',
            mapping: { user_id: 'user_id'},
            rules: {
                onDelete: 'CASCADE',
                onUpdate: 'RESTRICT'
            }
        }
    },
      completed: 'boolean' 
  }, callback);
};

exports.down = function(db, callback) {
  return db.dropTable('orders');
};

exports._meta = {
  "version": 1
};
