<template>
  <v-app>
    <Sidebar :drawer="drawer" />
    <Topbar @drawerEvent="drawer = !drawer" />
    <v-main> 
      <v-container class="py-8 px-6" fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { ref } from 'vue';
import Sidebar from './components/SideBar.vue';
import Topbar from './components/TopBar.vue';

export default {
  name: 'App',
  components: { Topbar, Sidebar },
  setup() {
   
    const drawer = ref(null);

    return {
    
      drawer,
    };
  },
};

</script>

