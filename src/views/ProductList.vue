<template>
  <div>
    <h1 class="black-text">Product List</h1>
    <v-col>
      <v-card>
        <v-data-table :headers="headers" :items="products" :items-per-page="5"
          class="elevation-1">
          <!-- Define slots for each item property -->
          <template v-for="header in headers" v-slot:[`item.${header.value}`]="{ item }">
            <template v-if="header.value === 'name'">
              {{ item[header.value] }}
            </template>
            <template v-else-if="header.value === 'images'">
              <div v-for="(image, index) in item[header.value]" :key="index">
                <img :src="image" alt="Product Image" style="width: 100px; height: 100px;">
              </div>
            </template>
            <template v-else-if="header.value === 'DateTime'">
              {{ formatDateTime(item[header.value]) }}
            </template>
            <div v-else-if="header.value === 'actions'" :key="header.value" style="display: flex; gap: 10px;">
              <v-btn color="primary" @click="viewProduct(item)">View</v-btn>
              <v-btn color="warning" @click="editProduct(item)">Edit</v-btn>
              <v-btn color="error" @click="deleteProduct(item)">Delete</v-btn>
            </div>
            <div v-else :key="header.value">
              {{ item[header.value] }}
            </div>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </div>
</template>

<script>
import axios from 'axios';
export default {

  data() {
    return {
      products: [],
      headers: [
        { text: 'ID', value: 'id', align: 'start', width: '30px' },
        { text: 'Name', value: 'Name', align: 'start', width: '200px' },
        { text: 'Category', value: 'Category', align: 'start', width: '200px' },
        { text: 'Description', value: 'Description', align: 'start', width: '400px' },
        { text: 'DateTime', value: 'DateTime', align: 'start', width: '200px' },
        { text: 'Images', value: 'images', align: 'start', width: '150px' },
        { text: 'Action', value: 'actions', align: 'start', width: '250px' },
      ],
    };
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/products');
        this.products = response.data;
        console.log("data", response.data)
      } 
      catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    formatDateTime(datetime) {
    const options = {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    };

      const date = new Date(datetime);
      return date.toLocaleDateString('en-US', options);
    }, 

    viewProduct(product) {
      // Logic to view the product details
      console.log('View:', product);
    },
    editProduct(product) {
      // Logic to edit the product details
      console.log('Edit:', product);
    },
    deleteProduct(product) {
      // Logic to delete the product
      console.log('Delete:', product);
    },
  }
}
</script>
