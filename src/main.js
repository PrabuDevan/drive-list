import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import store from './store'
import vuetify from './plugins/vuetify';
import LoadScript from 'vue-plugin-load-script';

Vue.use(LoadScript);
if (!window.gapi) {
  Vue.loadScript("https://apis.google.com/js/api.js").then(() => {
    const gapi = window.gapi;
    gapi.load('client:auth2', () => {
      gapi.client.init({
        apiKey: 'AIzaSyCZpskkk3ggfa7TRxf4kFC5BcvPaueMAGY',
        clientId: '447243147492-4nm0frk4cbr2r0dk4da6esoltkp89ar0.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/drive.metadata.readonly',
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]
      }).then(() => {
        store.state.googleAuth = gapi.auth2.getAuthInstance();
        if (store.state.googleAuth.isSignedIn.get()) {
          gapi.client.drive.files.list({
            pageSize: 10,
            fields:
              "nextPageToken, files(id, name, shared, size, createdTime, modifiedTime)",
          }).then(res => {
            store.state.files = res.result.files;
            store.state.nextPageToken = res.result.nextPageToken;
          });
        }
      })
    });
  })
}
Vue.config.productionTip = false

new Vue({
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
