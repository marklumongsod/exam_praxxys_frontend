<template>
    <div class="dashboard">
        <v-subheader class="py-0 d-flex justify-space-between rounded-lg">
            <h3>Dashboard</h3>
            <router-link to="/product-list">
                <v-btn color="success">View Products</v-btn>
            </router-link>
        </v-subheader>
        <br>
        <v-row>
            <v-col lg="7" cols="12">
                <v-alert dense text type="info">
                    Hello Admin Praxxys! Have a great <strong>day</strong>
                </v-alert>
                <v-row>
                    <v-col lg="6" cols="12" v-for="(item, index) in activityLog" :key="index">
                        <v-card elevation="2" class="rounded-lg">
                            <v-card-text class="d-flex justify-space-between align-center">
                                <div>
                                    <strong>{{ item.title }}</strong> <br>
                                    <span>Last 3 weeks</span>
                                </div>
                                <v-avatar size="60" :color="item.color" style="border: 3px solid #444">
                                    <span style="color: white">{{ item.amount }} </span>
                                </v-avatar>
                            </v-card-text>
                            <v-card-actions class="d-flex justify-space-between">


                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="12" lg="5">
                <v-card>
                    <v-card-title>Activities</v-card-title>
                    <v-card-text class="py-0">
                        <v-timeline align-top dense>
                            <v-timeline-item color="indigo" small>
                                <strong>1 minute/s ago</strong>
                                <div class="text-caption">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, labore et dolore magna aliqua.
                                </div>
                            </v-timeline-item>
                            <v-timeline-item color="green" small>
                                <strong>23 minute/s ago</strong>
                                <div class="text-caption mb-2">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, labore et dolore magna aliqua.
                                </div>
                            </v-timeline-item>

                            <v-timeline-item color="indigo" small>
                                <strong>58 minute/s ago</strong>
                                <div class="text-caption">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, labore et dolore magna aliqua.
                                </div>
                            </v-timeline-item>
                        </v-timeline>
                    </v-card-text>
                </v-card>
        
       
            </v-col>
        </v-row>
    </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "MainDashboard",
  data() {
    return {
      activityLog: [],
      productCount: '',
    }
  },
  mounted() {
    this.fetchProductCount();
  },
  methods: {
    onButtonClick(item) {
      console.log('click on ' + item.no)
    },
    async fetchProductCount() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/products/count');
        this.productCount = response.data.count;
        this.updateActivityLog(); 
      } catch (error) {
        console.error('Error fetching product count:', error);
      }
    },
    updateActivityLog() {
      this.activityLog = [
        { title: 'Total Products', amount: this.productCount, icon: 'mdi-account', color: 'cyan lighten-3' },
        { title: 'Imperdiet', amount: 0, icon: 'mdi-account-group-outline', color: 'green darken-2' },
        { title: 'Imperdiet', amount: 0, icon: 'mdi-account-group-outline', color: 'blue-grey darken-1' },
        { title: 'Imperdiet', amount: 0, icon: 'mdi-account-group-outline', color: 'deep-orange darken-1' },
      ];
    },
  },
};
</script>


<style scoped>
.overlap-icon {
    position: absolute;
    top: -33px;
    text-align: center;
    padding-top: 12px;
}
</style>