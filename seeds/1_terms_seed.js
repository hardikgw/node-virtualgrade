
exports.seed = function(knex, Promise) {
  return knex('terms').del()
    .then(function () {
      return knex('terms').insert([
        {id: 1, term: '2017f', current: true},
        {id: 2, term: '2017s', current: false},
        {id: 3, term: '2016f', current: false}
      ]);
    });
};
