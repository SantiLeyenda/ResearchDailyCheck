exports.up = (pgm) => {
    pgm.createTable('experiments', {
        id: 'id',
        title: {
            type: 'varchar(123)',
            notNull: true
        },
        hypothesis: { type: 'text' },
        approach: { type: 'text' },
        config: { type: 'jsonb' },
        status: {
            type: 'varchar(50)',
            default: 'planned'
        },
        startedOn: { type: 'date' },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp')
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp')
        }
    });

    
    pgm.createIndex('experiments', 'status');
    pgm.createIndex('experiments', 'created_at');
};

exports.down = (pgm) => {
    pgm.dropTable('experiments');
};