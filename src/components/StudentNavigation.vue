<template>
       <v-navigation-drawer app permanent>
                    <v-list>
                        <RouterLink class="redirectLink" to="/cloze_questions">
                            <v-list-item >
                                <v-list-item-title >Take Quiz</v-list-item-title>
                            </v-list-item>
                        </RouterLink>
                        <RouterLink class="redirectLink" to="/human_mc_questions">
                            <v-list-item >
                                <v-list-item-title>Practice</v-list-item-title>
                            </v-list-item>
                        </RouterLink>
                        <RouterLink class="redirectLink" to="/#">
                            <v-list-item >
                                <v-list-item-title>Perfomance History</v-list-item-title>
                            </v-list-item>
                        </RouterLink>
                        <RouterLink class="redirectLink" to="/#">
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