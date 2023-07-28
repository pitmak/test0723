const sdk = await new AppExtensionsSDK().initialize();
await sdk.execute('resize', { height: 500, width: 900 });

const BASE_URL = 'https://api.pipedrive.com/v1'
const API_TOKEN = 'cacb34a6879243a3c4626e1fc44bc8209704685d';

const formEl = document.querySelector('form');

formEl.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('on submit form');

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
  };

  const url = `${BASE_URL}/deals?api_token=${API_TOKEN}`;
  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  });

  let result = await response.json();
  alert(result.message);
  await sdk.execute('close_modal');
  //await sdk.execute(Command.REDIRECT_TO, { view: View.DEALS });
});