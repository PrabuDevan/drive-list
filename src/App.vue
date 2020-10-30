<template>
  <v-app id="app">
    <v-app-bar app clipped-left color="white" flat
      ><span v-if="isSignedIn" class="text-h5 font-weight-bold"
        >Welcome, {{ profile.getName() }}</span
      ></v-app-bar
    >
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-btn
              class="text-none font-weight-bold"
              depressed
              :ripple="false"
              v-if="!isSignedIn"
              @click.prevent="signIn"
            >
              Login<v-icon small right>mdi-google</v-icon></v-btn
            >
            <v-btn
              class="text-none text-caption font-weight-bold"
              depressed
              :ripple="false"
              v-else
              @click.prevent="signOut"
              >Logout <v-icon small right>mdi-logout</v-icon></v-btn
            >
          </v-col>
        </v-row>
        <v-row v-if="!isSignedIn">
          <v-col class="text-body-2 font-weight-bold" cols="12">
            Login to view your google drive files
          </v-col>
        </v-row>
        <v-row v-if="isSignedIn">
          <v-col>
            <v-card flat>
              <v-card-title class="text-body-2 font-weight-bold">
                Your files in google drive
              </v-card-title>
              <v-data-table
                dense
                :headers="headers"
                hide-default-footer
                disable-pagination
                :items="files"
              >
                <template v-slot:[`item.shared`]="{ item }">
                  <div>{{ item.shared ? "Public" : "Private" }}</div>
                </template>
                <template v-slot:[`item.size`]="{ item }">
                  <div>{{ itemSize(item.size) }}</div>
                </template>
                <template v-slot:[`item.createdTime`]="{ item }">
                  <div>{{ changeDate(item.createdTime) }}</div>
                </template>
                <template v-slot:[`item.modifiedTime`]="{ item }">
                  <div>{{ changeDate(item.modifiedTime) }}</div>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-if="isSignedIn">
          <v-col cols="12">
            <v-btn
              depressed
              :ripple="false"
              @click="viewMore"
              class="text-none text-caption font-weight-bold mt-5"
              >view more</v-btn
            >
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  components: {},
  data: () => ({
    headers: [
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "name",
      },
      {
        text: "Created Date",
        align: "start",
        sortable: false,
        value: "createdTime",
      },
      {
        text: "Last Modified",
        align: "start",
        sortable: false,
        value: "modifiedTime",
      },
      {
        text: "Size",
        align: "start",
        sortable: false,
        value: "size",
      },
      {
        text: "Sharing Status",
        align: "center",
        sortable: false,
        value: "shared",
      },
    ],
  }),
  computed: {
    ...mapGetters(["isSignedIn", "files", "profile"]),
  },
  methods: {
    changeDate(date) {
      return moment(date).format("hh:MM A MMM DD YYYY");
    },
    itemSize(size) {
      if (!size) return "N/A";
      else {
        return `${(size / 1048576).toFixed(2)} MB`;
      }
    },
    signIn() {
      this.$store.state.googleAuth
        .signIn()
        .then(() => this.getFilesFromDrive());
    },
    signOut() {
      this.$store.state.googleAuth.signOut();
      this.$store.commit("GO_TO_INITIAL_STATE");
    },
    getFilesFromDrive() {
      this.$store.dispatch("UPDATE_FILES_LIST", {
        pageSize: 10,
        fields:
          "nextPageToken, files(id, name, shared, size, createdTime, modifiedTime)",
      });
    },
    viewMore() {
      this.$store.dispatch("VIEW_MORE");
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
