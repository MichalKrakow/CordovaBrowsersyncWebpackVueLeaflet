<template>
	<div class="app">
		<v-map ref="map" style="height: 100%" :zoom="zoom" :center="center" class="map">
	        <v-tilelayer :url="url" :attribution="attribution" ></v-tilelayer>
	        <v-marker ref="myLoc" :lat-lng="marker"></v-marker>
	    </v-map>
	    <div class="info">
	    	<span>position: <b v-html="lat"></b> <b v-html="lng"></b></span>
	    	<br/><span>altitude: {{alt}}</span>
	    	<span>accuracy: {{acc}}</span>
	    	<span>speed: {{spd}}</span>
	    </div>
    </div>
</template>

<script>
import Vue2Leaflet from 'vue2-leaflet';
// L.Icon.Default.imagePath = '.';

// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: require('../node_modules/leaflet/dist/images/marker-icon-2x.png'),
//     iconUrl: require('../node_modules/leaflet/dist/images/marker-icon.png'),
//     shadowUrl: require('../node_modules/leaflet/dist/images/marker-shadow.png'),
// });

export default {
  name: 'App',
  components: {
  	'v-map': Vue2Leaflet.Map,
    'v-tilelayer' :Vue2Leaflet.TileLayer,
    'v-marker': Vue2Leaflet.Marker,
    'v-tooltip': Vue2Leaflet.Tooltip,
    'v-popup': Vue2Leaflet.Popup,
    'v-polyline': Vue2Leaflet.Polyline,
  },
  methods: {
  	move(e){
        this.currentCenter = this.$refs.map.mapObject.getCenter();
    },
    onSuccess(e){
    	this.marker.lat = e.coords.latitude;
    	this.marker.lng = e.coords.longitude;
        this.$refs.map.mapObject.setView(this.marker, 17);
    	this.$refs.myLoc.mapObject.setLatLng(this.marker)
    	console.log(e);
    	this.location = e.coords;
    },
    onError(e){
        console.log(e);
    },
    ddToDms(D){
    	return [0|D,"&deg;", 0|(D<0?D=-D:D)%1*60, "'", 0|D*60%1*60, '"'].join('');
    }
  },
  data () {
    return {
    	date: new Date(Date.now()),
	    email: '',
	    name: '',
	    zoom:13,
	    markers: [],
	    location: {},
	    currentCenter: L.latLng(50.029206, 19.875053),
	    center: L.latLng(50.029206, 19.875053),
	    url:'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
	    attribution:'',
	    marker: L.latLng(50.029206, 19.875053),
    };
  },
  computed: {
  	lat: function() {
  		return this.ddToDms(this.location.latitude);
  	},
  	lng: function(){
  		return this.ddToDms(this.location.longitude);
  	},
  	acc: function(){
  		return this.location.accuracy == undefined ? "-" : Math.round(this.location.accuracy);
  	},
  	spd: function(){
  		return this.location.speed == undefined ? "-" : Math.round(this.location.speed / 0.277777777778);
  	},
  	alt: function(){
  		return this.location.altitude == undefined ? "-" : Math.round(this.location.altitude);
  	}
  },
  mounted() {
  	this.$refs.map.mapObject.attributionControl.setPrefix('');
  },
  created(){
  	var watchID = navigator.geolocation.watchPosition(this.onSuccess, this.onError, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
  }
};
</script>

<style lang="sass" scoped>
$footHeight: 60px

#app, .app
    width: 100%
    height: 100%
    background: #000
    margin: 0
    padding: 0
.map
    width: 100%
    height: calc(100% - #{$footHeight}) !important
    margin: 0
    padding 0
.info
	height: $footHeight
	bottom: 0px
	position: absolute
	width: 100%
	left: 0px
	box-sizing: border-box
	padding: 20px	

</style>