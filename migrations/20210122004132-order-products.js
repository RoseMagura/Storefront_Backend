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
  db.createTable('order_products', {
      order_id: {
          type: 'int',
          notNull: true,
          foreignKey: {
              name: 'order_id_fk',
              table: 'orders',
              rules: {
                  onDelete: 'CASCADE',
                  onUpdate: 'CASCADE'
              },
              mapping: 'order_id'
          }
      }, 
      product_id: {
        type: 'int',
        notNull: true,
        foreignKey: {
            name: 'product_id_fk',
            table: 'products',
            rules: {
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            mapping: 'product_id'
        }
      },
      count: 'int'
}, callback);
};

exports.down = function(db, callback) {
  return db.dropTable('order_products');
};

exports._meta = {
  "version": 1
};
