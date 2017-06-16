require('../sass/app.sass');

window.axios = require('axios');
//window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';


import Vue from 'vue';
import App from '../components/App.vue'

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {

        this.receivedEvent('deviceready');
        var vueLoc = new Vue({
            data: {
                nav: null,
            },
            created() {
            },
            methods: {
                
            }
        });

        var vueApp = new Vue({
          el: '#app',
          template: '<App/>',
          components: { App }
        });
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};

app.initialize();