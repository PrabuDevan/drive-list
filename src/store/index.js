import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    googleAuth: undefined,
    accessToken: undefined,
    files: undefined,
    nextPageToken: undefined
  },
  mutations: {
    UPDATE_PROFILE(state, profile) {
      state.profile = profile;
    },
    UPDATE_FILES_LIST(state, files) {
      state.files = files;
    },
    UPDATE_NEXT_PAGE_TOKEN(state, token) {
      state.nextPageToken = token;
    },
    GO_TO_INITIAL_STATE(state) {
      state.accessToken = undefined;
      window.location.reload();
    }
  },
  actions: {
    UPDATE_FILES_LIST({ commit }, config) {
      window.gapi.client.drive.files.list(config).then(res => {
        commit("UPDATE_FILES_LIST", res.result.files);
        commit("UPDATE_NEXT_PAGE_TOKEN", res.result.nextPageToken);
      });
    },
    VIEW_MORE({ commit, state }) {
      // window.gapi.client.drive.files.list({
      //   pageToken: state.nextPageToken,
      //   pageSize: 10,
      //   fields:
      //     "nextPageToken, files(id, name, shared, size, createdTime, modifiedTime)"
      // }).then(res => {
      //   commit("UPDATE_FILES_LIST", [...state.files, ...res.result.files]);
      //   commit("UPDATE_NEXT_PAGE_TOKEN", res.result.nextPageToken);
      // });
      axios.post("http://localhost:8000/drive/next_page/", {
        pageToken: state.nextPageToken,
        access_token: state.accessToken
      }).then(res => {
        if (res.status === 200) {
          commit("UPDATE_FILES_LIST", [...state.files, ...res.data.files]);
          commit("UPDATE_NEXT_PAGE_TOKEN", res.data.nextPageToken);
        }
      });
    }
  },
  getters: {
    profile(state) {
      return state.googleAuth && state.googleAuth.currentUser.get().getBasicProfile();
    },
    isSignedIn(state) {
      return state.googleAuth && state.googleAuth.isSignedIn.get();
    },
    files(state) {
      return state.files;
    }
  },
  modules: {
  }
})
