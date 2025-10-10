<template>
       
        <v-navigation-drawer
        v-model="drawer"   
         app
        :permanent="$vuetify.display.mdAndUp"
        temporary
        >
                    <v-list>
                        <RouterLink class="redirectLink" to="/#">
                            <v-list-item >
                                <v-list-item-title>Dashboard</v-list-item-title>
                            </v-list-item>
                        </RouterLink>
                        <RouterLink class="redirectLink" to="/create_questions">
                            <v-list-item >
                                <v-list-item-title >Create Question</v-list-item-title>
                            </v-list-item>
                        </RouterLink>
                        <RouterLink class="redirectLink" to="/admin_add_unit">
                            <v-list-item >
                                <v-list-item-title >Add Organizations Units</v-list-item-title>
                            </v-list-item>
                        </RouterLink>
                        <RouterLink class="redirectLink" to="/">
                            <v-list-item >
                                <v-list-item-title>Profile</v-list-item-title>
                            </v-list-item>
                        </RouterLink>
                        <RouterLink class="redirectLink" to="/">
                            <v-list-item>
                                <v-list-item-title>Logout</v-list-item-title>
                            </v-list-item>
                        </RouterLink>
                    </v-list>
                </v-navigation-drawer>
                
   <v-app-bar app>
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" />
    </v-app-bar>
 
</template>
<script setup>
import { ref } from 'vue';

const drawer = ref(null)


</script>

<style>
.redirectLink{
    text-decoration: none;
    color: black;
}
</style>