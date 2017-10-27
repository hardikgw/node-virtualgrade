
exports.seed = function(knex, Promise) {
  return knex('departments').del()
    .then(function () {
      return knex('departments').insert([
        {id: 1, name: 'COMP', manage_group: 'virtualgrade'},
        {id: 2, name: 'MATH', manage_group: 'math'},
        {id: 3, name: 'EE', manage_group: 'ee'}
      ]);
    });
};
