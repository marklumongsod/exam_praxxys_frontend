<template>
  <div>

    <v-snackbar v-model="alert.show" :timeout="alert.timeout" :color="alert.color" top>
      {{ alert.message }}
      <v-btn text @click="alert.show = false">Close</v-btn>
    </v-snackbar>

    <v-subheader class="py-0 d-flex justify-space-between rounded-lg">
            <h3>Product List</h3>
            <v-btn color="primary" @click="showCreateDialog = true">Create Product</v-btn>
        </v-subheader>
    <v-col>
      <v-card>
        <v-data-table :headers="headers" :items="products" :items-per-page="5"
          class="elevation-1">
    
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
              <v-btn color="error" @click="confirmDelete(item)">Delete</v-btn>
              <v-dialog v-model="deleteConfirmation" max-width="400">
                <v-card>
                  <v-card-title>Confirm Deletion</v-card-title>
                  <v-card-text>Are you sure you want to delete this product?</v-card-text>
                  <v-card-actions>
                    <v-btn color="error" @click="deleteConfirmed(item)">Yes, Delete</v-btn>
                    <v-btn @click="cancelDelete">Cancel</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
            <div v-else :key="header.value">
              {{ item[header.value] }}
            </div>
          </template>
        </v-data-table>
      </v-card>
    </v-col>

    <v-dialog v-model="showCreateDialog" max-width="500">
    <v-card>
      <v-stepper v-model="step">
        <v-stepper-header>
          <v-stepper-step :complete="step > 1" step="1">Step 1</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="step > 2" step="2">Step 2</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="step > 3" step="3">Step 3</v-stepper-step>
        </v-stepper-header>

        <!-- Step 1 -->
        <v-stepper-content step="1">
          <v-card-title>Create New Product - Step 1</v-card-title>
          <v-form ref="step1Form" @submit.prevent="validateStep1">
            <v-text-field
              v-model="newProduct.name"
              :class="{'error--text': shouldShowError('name')}"
              label="Name"
            ></v-text-field>
            <v-select
              v-model="newProduct.category"
              :items="categoryOptions"
              :class="{'error--text': shouldShowError('category')}"
              label="Category"
            ></v-select>
            <v-text-field
              v-model="newProduct.description"
              :class="{'error--text': shouldShowError('description')}"
              label="Description"
            ></v-text-field>
            <v-btn type="submit" color="primary">Next</v-btn>
          </v-form>
        </v-stepper-content>

        <!-- Step 2 -->
        <v-stepper-content step="2">
          <v-card-title>Create New Product - Step 2</v-card-title>
          <v-form ref="step2Form" @submit.prevent="validateStep2">
            <v-file-input multiple accept="image/*" v-model="selectedFiles"></v-file-input>
            <v-btn type="submit" color="primary">Next</v-btn>
          </v-form>
        </v-stepper-content>

        <!-- Step 3 -->
        <v-stepper-content step="3">
          <v-card-title>Create New Product - Step 3</v-card-title>
          <v-form ref="step3Form" @submit.prevent="validateStep3">
            <v-date-picker v-model="newProduct.date" scrollable></v-date-picker>
            <v-time-picker v-model="newProduct.time" format="24hr"></v-time-picker>
            <!-- <v-btn type="submit" color="primary">Create Product</v-btn> -->
            <v-btn :disabled="!newProduct.date || !newProduct.time" type="submit" color="primary">Create Product</v-btn>
          </v-form>
        </v-stepper-content>
        
      </v-stepper>
    </v-card>
  </v-dialog>

    <v-dialog v-model="showProductDetailsDialog" max-width="500">
    <v-card>
      <v-card-title>Product Details</v-card-title>
      <v-card-text v-if="selectedProduct">
        <div>
          <strong>Name:</strong> {{ selectedProduct.Name }}
        </div>
        <div>
          <strong>Description:</strong> {{ selectedProduct.Description }}
        </div>
        <div>
          <strong>Category of the product:</strong> {{ selectedProduct.Category }}
        </div>
        <div>
          <strong>Images:</strong> {{ selectedProduct.Images }}
        </div>

     
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="showProductDetailsDialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';
export default {

  data() {
    return {
      step1Errors: {},
      selectedFiles: [],
      showCreateDialog: false,
      step: 1,
      newProduct: {
          name: '',
          category: '',
          description: '',
          images: 'NULL'
        },
      categoryOptions: [
      'Electronics',
      'Apparel & Fashion',
      'Home & Kitchen Appliances',
      'Health & Wellness',
      'Sports & Outdoors',
    ],
      showProductDetailsDialog: false,
      selectedProduct: null,
      alert: {
        show: false,
        message: '',
        timeout: 3000, 
        color: 'success', 
      },
      deleteConfirmation: false,
      products: [],
      headers: [
        { text: 'ID', value: 'id', align: 'start', width: '80px' },
        { text: 'Name', value: 'Name', align: 'start', width: '200px' },
        { text: 'Category', value: 'Category', align: 'start', width: '200px' },
        { text: 'Description', value: 'Description', align: 'start', width: '400px' },
        { text: 'DateTime', value: 'DateTime', align: 'start', width: '200px' },
        { text: 'Images', value: 'images', align: 'start', width: '150px' },
        { text: 'Action', value: 'actions', align: 'start', width: '250px' },
      ],
    };
  },
  computed: {
    shouldShowError() {
      return (fieldName) => {
        return !this.newProduct[fieldName];
      };
    },
  },
  
  mounted() {
    this.fetchProducts();
  },
  methods: {
    async validateStep1() {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/product/create/step_1', this.newProduct);
    console.log('Step 1 data:', response.data.step1);
    this.step = 2; 
  } catch (error) {
    console.error('Error validating step 1:', error);
    this.step1Errors = error.response.data.errors;
  }
},

async validateStep2() {
  try {
    // Prepare FormData
    const formData = new FormData();
    this.selectedFiles.forEach(file => {
      formData.append('images[]', file);
    });

    const response = await axios.post('http://127.0.0.1:8000/api/product/create/step_2', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Step 2 data:', response.data.step2);

    if (response.status === 200 && response.data && response.data.step2) {
      this.step = 3; // Move to Step 3 after successful validation of Step 2
    } else {
      // Handle validation errors for Step 2
      if (response.data && response.data.errors) {
        // Handle specific errors if needed
      } else {
        // Handle other errors if needed
      }
    }
  } catch (error) {
    console.error('Error validating step 2:', error);
    // Handle error, display message, etc.
  }
},
async validateStep3() {
  try {
    const selectedDate = new Date(this.newProduct.date);
    const selectedTime = new Date(`2000-01-01T${this.newProduct.time}`);

    if (!isNaN(selectedDate) && !isNaN(selectedTime)) {
      // Format datetime as "YYYY-MM-DD HH:mm:ss"
      const formattedDateTime = `${this.newProduct.date} ${this.newProduct.time}`;
      console.log('DateTime:', formattedDateTime);
      
      const mergedData = {
        step1: {
          name: this.newProduct.name,
          category: this.newProduct.category,
          description: this.newProduct.description,
        },
        step2: {
          images: this.newProduct.images,
        },
        datetime: formattedDateTime,
      };

      console.log('mergedData:', mergedData);
      const response = await axios.post('http://127.0.0.1:8000/api/product/create/step_3', mergedData);
      console.log('Product created successfully:', response.data.message);

      this.alert.message = 'You have successfully created the product.';
      this.alert.color = 'success';
      this.alert.show = true;

      this.showCreateDialog = false,
      this.fetchProducts();
    } else {
      // Invalid date or time, handle validation error
      // You might want to show an error message to the user
    }
  } catch (error) {
    console.error('Error validating Step 3:', error);
    // Handle error, display message, etc.
  }
},



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

    cancelCreate() {
      // Reset the form and close the dialog without creating the product
      this.newProduct.name = '';
      this.newProduct.description = '';
      // Reset other fields if needed
      this.showCreateDialog = false;
    },
    async viewProduct(item) {
      const productId = item.id; 
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/products/${productId}`);
        this.selectedProduct = response.data;
        console.log("data selected", response.data)
        this.showProductDetailsDialog = true; 
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    },
    editProduct(product) {
      // Logic to edit the product details
      console.log('Edit:', product);
    },
    confirmDelete(item) {
      this.itemToDelete = item; 
      this.deleteConfirmation = true;
    },
    async deleteConfirmed(item) {
      this.deleteConfirmation = false;
      const productId = item.id; 
      try {
      
        await axios.delete(`http://127.0.0.1:8000/api/products/${productId}`);
        console.log(`Product with ID ${productId} has been deleted.`);
        
        this.alert.message = 'You have successfully deleted the product.';
        this.alert.color = 'success';
        this.alert.show = true;
  
        this.fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        this.alert.message = 'Failed to delete the product.';
        this.alert.color = 'error';
        this.alert.show = true;
      }
    },
    cancelDelete() {
      this.deleteConfirmation = false; 
    },
   
  }
}
</script>
<style>
.error--text {
  border-color: red; /* Change the border color to red */
}</style>
