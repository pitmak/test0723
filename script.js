const sdk = await new AppExtensionsSDK().initialize();
await sdk.execute('resize', { height: 500, width: 900 });

const BASE_URL = 'https://api.pipedrive.com/v1'
const API_TOKEN = 'cacb34a6879243a3c4626e1fc44bc8209704685d';

const fetchQuery = async (endpoint, method, body) => {
  const url = `${BASE_URL}/${endpoint}?api_token=${API_TOKEN}`;
  const data = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (body) {
    data.body = JSON.stringify(body);
  };

  const response = await fetch(url, data);
  const result = await response.json();

  return result;
};

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

  let result = await fetchQuery('dealFields', 'GET');
  result.data.forEach(({ key, name }) => {
    if (Object.hasOwn(customFieldKey, name)) {
      customFieldKey[name] = key;
    }
  });

  const personData = {
    name: `${e.target.elements.firstname.value} ${e.target.elements.lastname.value}`,
    email: [{ value: e.target.elements.email.value, primary: 'true', label: 'main' }],
    phone: [{ value: e.target.elements.phone.value, primary: 'true', label: 'mobile' }],
  };

  result = await fetchQuery('persons', 'POST', personData);
  console.log(result.data);
  const personId = result.data.id;

  const dealData = {
    title: 'New job',
    // value: 10000,
    // currency: 'USD',
    // user_id: null,
    person_id: personId,
    // org_id: 1,
    // stage_id: 1,
    status: 'open',
    // expected_close_date: '2022-02-11',
    // probability: 60,
    // lost_reason: null,
    visible_to: 1,
    // add_time: '2021-02-11',
    [customFieldKey['Address']]: e.target.elements.address.value,
    [customFieldKey['Job type']]: e.target.elements.jobtype.value,
    [customFieldKey['Job source']]: e.target.elements.jobsource.value,
    [customFieldKey['Job date']]: e.target.elements.startdate.value,
    [customFieldKey['Job start time']]: e.target.elements.starttime.value,
    [customFieldKey['Job end time']]: e.target.elements.endtime.value,
    [customFieldKey['Technician']]: e.target.elements.techincian.value,
    [customFieldKey['Area']]: e.target.elements.area.value,
    [customFieldKey['Job comment']]: e.target.elements.jobdescription.value,
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
  result = await fetchQuery('deals', 'POST', dealData);
  console.log(result.data);

  const dealId = result.data.id;

  //await sdk.execute('close_modal');
  await sdk.execute('redirect_to', { view: 'deals', id: dealId });
});