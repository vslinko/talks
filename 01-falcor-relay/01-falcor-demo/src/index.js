const falcor = require('falcor');
const HttpDataSource = require('falcor-http-datasource');

const log = (prefix) => (...args) => console.log(prefix, ...args);

const model = falcor({
  source: new HttpDataSource('/model.json'),
});

function getRange1() {
  return model
    .get('users[0..2]["name","age"]')
    .then(log('getRange1'), log('getRange1 error'));
}

function getRange2() {
  return model
    .get(['users', {from: 0, to: 3}, ['name', 'age']])
    .then(log('getRange2'), log('getRange2 error'));
}

function subscribe() {
  let resolved = false;

  return new Promise((resolve) => {
    model
      .deref('users[0]', 'name')
      .subscribe((userModel) => {
        userModel.getValue('name')
          .subscribe((name) => {
            log('subscribe')(name);

            if (!resolved) {
              resolve();
              resolved = true;
            }
          });
      });
  });
}

function update() {
  return model
    .set({path: 'users[0].name', value: 'a'})
    .then(log('update'), log('update error'));
}

function call() {
  return model
    .call(
      ['users', 'create'],
      ['Smith', 25],
      [['name']],
      [['length']]
    )
    .then(log('call'), log('call error'));
}

Promise.resolve()
  .then(getRange1)
  .then(subscribe)
  .then(update)
  .then(call)
  .then(getRange2)
