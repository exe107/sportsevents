import { spinner } from '../store';

const call = (endpoint, method, body) => {
  const init = {
    method,
  };

  if (body) {
    init.body = JSON.stringify(body);
    init.headers = { 'Content-Type': 'application/json' };
  }

  const request = new Request(`http://localhost:8000${endpoint}`, init);
  spinner.update((state) => state + 1);

  return fetch(request).then((response) => {
    spinner.update((state) => state - 1);

    return response.json();
  });
};

const Method = {
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

export { call, Method };
