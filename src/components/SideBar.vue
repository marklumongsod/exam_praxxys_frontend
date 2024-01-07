<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
        <v-sheet color="grey-lighten-4" class="pa-4 d-flex flex-column align-center justify-center">
            <v-avatar class="mb-4" color="grey-darken-1" size="70">
                <v-img src="/avatar.png" alt="Avatar"></v-img>
            </v-avatar>
            <div class="text-center">admin_praxxys</div>
        </v-sheet>

      <v-divider></v-divider>

      <v-list>
        <v-list-item
          v-for="[icon, text] in links"
          :key="icon"
          :prepend-icon="icon"
          :title="text"
          link
        ></v-list-item>
      </v-list>
      <v-list dense>
        <v-list-item v-for="(item, index) in drawerItems" :key="index" @click="navigate(item)">
          <v-list-item-icon>
            <v-icon :class="{ 'text-primary': isActive(item.route) }">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title :class="{ 'font-weight-bold': isActive(item.route) }">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script>

    export default {
        name: "SideBarMenu",
        data() {
            return {
                drawer: true,
                drawerItems: [
                    { title: 'Dashboard', icon: 'mdi-view-dashboard', route: '/dashboard' },
                    { title: 'Product', icon: 'mdi-basket', route: '/product-list' },
                    { title: 'Videos Link', icon: 'mdi-file-video', route: '/video-list' },
                ],
                
            }
        },
        methods: {
            isActive(route) {
              return this.$route.path === route;
            },
            navigate(item) {
              if (!this.isActive(item.route)) {
                this.$router.push(item.route);
              }
            },
         },
         mounted() {
          console.log('Product.vue component mounted');
          // Add any other logic you want to execute when the component mounts
        }
        

    }
</script>

<style scoped>
    .overlap-icon {
        position: absolute;
        top: -33px;
        text-align: center;
        padding-top: 12px;
    }

</style>