<template>
       <v-navigation-drawer app permanent>
                    <v-list>
                        <v-list-item >
                            <v-list-item-title>Dashboard</v-list-item-title>
                        </v-list-item>
                        <v-list-item >
                            <v-list-item-title to="/create_mc_questions">Create Question</v-list-item-title>
                        </v-list-item>
                        <v-list-item >
                            <v-list-item-title>Profile</v-list-item-title>
                        </v-list-item>
                        <v-list-item to="/">
                            <v-list-item-title>Logout</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-navigation-drawer>
</template>