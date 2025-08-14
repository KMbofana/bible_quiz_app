<template>
    <v-container>
        <v-row>
            <v-col cols="2">
                <v-navigation-drawer app>
                    <v-list>
                        <v-list-item to="/#">
                            <v-list-item-title>Home</v-list-item-title>
                        </v-list-item>
                        <v-list-item to="#">
                            <v-list-item-title>Perfomance History</v-list-item-title>
                        </v-list-item>
                        <v-list-item to="/#">
                            <v-list-item-title>Profile</v-list-item-title>
                        </v-list-item>
                        <v-list-item to="/login">
                            <v-list-item-title>Logout</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-navigation-drawer>
            </v-col>
            <v-col cols="12">
                <v-card>
                    <v-card-title class="text-h5">Quiz Programs</v-card-title>
                    <v-card-text>
                        <p>Quiz levels are activate as you successfully enroll or qualify</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" to="/multiple_questions">District</v-btn>
                        <v-btn color="secondary" to="/cloze_questions" >Fedration</v-btn>
                        <v-btn color="success" to="/multiple_questions" disabled>Conference</v-btn>
                        <v-btn color="success" to="/cloze_questions" disabled>ZEUC</v-btn>
                        <v-btn color="success" to="/multiple_questions" disabled>SADC</v-btn>
                        <v-btn color="success" to="/cloze_questions" disabled>General Conference</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

    </v-container>
</template>