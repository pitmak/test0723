const sdk = await new AppExtensionsSDK().initialize();
await sdk.execute(Command.RESIZE, { height: 500, width: 900 });

const formEl = document.querySelector('form');

formEl.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('on submit form');
  //await sdk.execute(Command.CLOSE_MODAL);
  await sdk.execute(Command.REDIRECT_TO, { view: View.DEALS });
});