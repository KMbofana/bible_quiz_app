<template>
       <v-navigation-drawer app permanent>
                    <v-list>
                        <RouterLink class="redirectLink" to="/#">
                            <v-list-item >
                                <v-list-item-title>Dashboard</v-list-item-title>
                            </v-list-item>
                        </RouterLink>
                        <RouterLink class="redirectLink" to="/create_mc_questions">
                            <v-list-item >
                                <v-list-item-title >Create Question</v-list-item-title>
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
</template>

<style>
.redirectLink{
    text-decoration: none;
    color: black;
}
</style>