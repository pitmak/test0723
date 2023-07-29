const sdk = await new AppExtensionsSDK().initialize();
await sdk.execute('resize', { height: 520, width: 900 });

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

  const personId = result.data.id;

  const dealData = {
    title: 'New job',
    person_id: personId,
    status: 'open',
    visible_to: 1,
    [customFieldKey['Address']]: e.target.elements.address.value,
    [customFieldKey['Job type']]: e.target.elements.jobtype.value,
    [customFieldKey['Job source']]: e.target.elements.jobsource.value,
    [customFieldKey['Job date']]: e.target.elements.startdate.value,
    [customFieldKey['Job start time']]: e.target.elements.starttime.value,
    [customFieldKey['Job end time']]: e.target.elements.endtime.value,
    [customFieldKey['Technician']]: e.target.elements.technician.value,
    [customFieldKey['Area']]: e.target.elements.area.value,
    [customFieldKey['Job comment']]: e.target.elements.jobdescription.value,
  };

  result = await fetchQuery('deals', 'POST', dealData);

  const dealId = result.data.id;

  await sdk.execute('redirect_to', { view: 'deals', id: dealId });
  await sdk.execute('close_modal');
});