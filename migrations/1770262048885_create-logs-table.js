exports.up = (pgm) => {
    pgm.createTable('logs', {
        id: 'id', 
        date: {
            type: 'date',
            notNull: true,
            unique: true
        },
        did: { type: 'text' },
        blockers: { type: 'text' },
        todo: { type: 'text' },
        minuteSpent: {
            type: 'integer',
            notNull: true
        },
        mood: { type: 'text' },
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
};

exports.down = (pgm) => {
    pgm.dropTable('logs');
};