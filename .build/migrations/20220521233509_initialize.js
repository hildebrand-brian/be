"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    await knex.schema.createTable('shipments', function (table) {
        table.increments('id').primary();
        table.string('referenceId').notNullable().unique();
        table.dateTime('estimatedTimeArrival').nullable();
    });
    await knex.schema.createTable('organizations', function (table) {
        table.string('id').primary();
        table.string('code').notNullable();
    });
    await knex.schema.createTable('shipmentOrganizations', function (table) {
        table.string('organizationId').notNullable();
        table.foreign('organizationId').references('organizations.id').onDelete('CASCADE');
        table.integer('shipmentId').notNullable();
        table.foreign('shipmentId').references('shipments.id').onDelete('CASCADE');
        table.primary(['organizationId', 'shipmentId']);
    });
    await knex.schema.createTable('shipmentTransportPackNodes', function (table) {
        table.integer('shipmentId').notNullable();
        table.foreign('shipmentId').references('shipments.id').onDelete('CASCADE');
        table.integer('weight').notNullable();
        table.string('unit').notNullable();
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.dropTableIfExists('shipmentOrganizations');
    await knex.schema.dropTableIfExists('shipmentTransportPackNodes');
    await knex.schema.dropTableIfExists('organizations');
    await knex.schema.dropTableIfExists('shipments');
}
exports.down = down;
//# sourceMappingURL=20220521233509_initialize.js.map