const sdk = await new AppExtensionsSDK().initialize();
await sdk.execute('resize', { height: 500, width: 900 });

const BASE_URL = 'https://api.pipedrive.com/v1'
const API_TOKEN = 'cacb34a6879243a3c4626e1fc44bc8209704685d';

const formEl = document.querySelector('form');

formEl.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('on submit form');

  const customFieldKey = {
    'Address': null,
    'Job type': null,
    'Job source': null,
    'Job date': null,
    'Job start time': null,
    'Job end time': null,
    'Technician': null,
    'Area': null,
    'Job comment': null,
  };

  let response = await fetch(`${BASE_URL}/dealFields?api_token=${API_TOKEN}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  let result = await response.json();
  result.data.forEach(({ key, name }) => {
    if (Object.hasOwn(customFieldKey, name)) {
      customFieldKey[name] = key;
    }
  });

  const personData = {
    name: `${e.target.elements.firstname.value} ${e.target.elements.lastname.value}`,
    email: [{ value: e.target.elements.email.value, primary: "true", label: "main" }],
    phone: [{ value: e.target.elements.phone.value, primary: "true", label: "mobile" }],
  };

  response = await fetch(`${BASE_URL}/persons?api_token=${API_TOKEN}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(personData),
  });

  result = await response.json();
  console.log(result.data);

  const data = {
    title: 'Deal of the century',
    value: 10000,
    currency: 'USD',
    user_id: null,
    person_id: null,
    org_id: 1,
    stage_id: 1,
    status: 'open',
    expected_close_date: '2022-02-11',
    probability: 60,
    lost_reason: null,
    visible_to: 1,
    add_time: '2021-02-11',
    [customFieldKey['Address']]: '1485 Langham Terrace, Heathrowm FL 32746, USA',
    [customFieldKey['Job type']]: 'simple job',
  };

  const url = `${BASE_URL}/deals?api_token=${API_TOKEN}`;
  response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  });

  result = await response.json();
  console.log(result.data);

  const dealId = result.data.id;

  //await sdk.execute('close_modal');
  //await sdk.execute(Command.REDIRECT_TO, { view: View.DEALS });
});