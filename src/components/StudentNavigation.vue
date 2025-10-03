<template>
       <v-navigation-drawer app permanent>
                    <v-list>
                        <v-list-item >
                            <v-list-item-title to="/cloze_questions">Take Quiz</v-list-item-title>
                        </v-list-item>
                        <v-list-item >
                            <v-list-item-title to="/human_mc_questions">Practice</v-list-item-title>
                        </v-list-item>
                        <v-list-item >
                            <v-list-item-title>Perfomance History</v-list-item-title>
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