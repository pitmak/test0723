const sdk = await new AppExtensionsSDK().initialize();

const formEl = document.querySelector('form');

formEl.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('on submit form');
  await sdk.execute(Command.CLOSE_MODAL);
});