const Router = require('falcor-router');
const R = require('ramda');

const log = require('better-log').setConfig({depth: null});

const users = [
  {name: 'Bill', age: 10},
  {name: 'John', age: 15},
  {name: 'David', age: 20},
];

const getUserById = (id) => ({
  id,
  user: users[id - 1],
});

module.exports = () => {
  return new Router([
    {
      route: 'usersById[{integers}]["name","age"]',
      get: (pathSet) => {
        const ids = pathSet[1];
        const keys = pathSet[2];

        const result = R.map(
          R.pipe(
            getUserById,
            (res) => ({
              path: ['usersById', res.id],
              value:
                res.user
                  ? R.pick(keys, {
                    name: res.user.name,
                    age: {$type: 'atom', value: res.user.age},
                  })
                  : {$type: 'error', value: 'User not found'}
            })
          ),
          ids
        );

        log('\nusersById pathSet');
        log(pathSet);
        log('\nusersById result');
        log(result);

        return result;
      },
      set: (jsonGraph) => {
        log('\nusersById set jsonGraph');
        log(jsonGraph);

        const usersById = jsonGraph.usersById;
        const ids = Object.keys(usersById);

        const result = [];

        ids
          .forEach((id) => {
            const index = id - 1;

            if (!users[index]) {
              result.push({
                $type: 'error',
                value: `User ${id} not found`,
              });

              return;
            }

            Object.keys(jsonGraph.usersById[id])
              .forEach((key) => {
                const value = jsonGraph.usersById[id][key];

                users[index][key] = value;

                result.push({
                  path: ['usersById', id, key],
                  value,
                });
              });
          });

        log('\nusersById set result');
        log(result);

        return result;
      }
    },
    {
      route: 'users[{integers}]',
      get: (pathSet) => {
        const indexes = pathSet[1];

        const result = R.map(
          (index) => ({
            path: ['users', index],
            value: {$type: 'ref', value: ['usersById', index + 1]},
          }),
          indexes
        );

        log('\nusers pathSet');
        log(pathSet);
        log('\nusers result');
        log(result);

        return result;
      },
    },
    {
      route: 'users.create',
      call(pathSet, args, refPaths, thisPaths) {
        log('\nusers.create');
        log(pathSet, args, refPaths, thisPaths);

        const name = args[0];
        const age = args[1];

        users.push({name, age});

        const id = users.length;
        const index = id - 1;

        const result = [
          {
            path: ['users', index],
            value: {$type: 'ref', value: ['usersById', id]},
          },
        ];

        log('\nusers.create result');
        log(result);

        return result;
      }
    }
  ]);
};
