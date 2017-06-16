<template>
	<div class="app">
		<v-map ref="map" @l-dragstart="onDragStart" style="height: 100%" :zoom="zoom" :center="center" class="map">
	        <v-tilelayer :url="url" :attribution="attribution" ></v-tilelayer>
	        <v-marker @l-click="onClickedSelfMarker" ref="myLoc" :lat-lng="marker"></v-marker>
          <v-marker v-for="item in markers" 
            :icon="item.icon" 
            :key="item.id" 
            :lat-lng="item.position"
            :color="item.color"
            v-if="item.show">
            <v-popup :content="'lat: ' + item.position.lat + '<br/>lng: ' + item.position.lng "></v-popup>
        </v-marker>
        <v-polyline v-for="line in markers"
            v-bind:key="line.id" 
            :lat-lngs="line.polyline.latlngs" 
            :color="line.polyline.color"
            v-if="line.show" >
        </v-polyline>
	    </v-map>
      <div class="controlls">
        <RangerSwitch v-model="trace" @change="traceChange">trace me</RangerSwitch><!--
     --><RangerButton @touchend="updateMarkers">update</RangerButton>
      </div>
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
import RangerSwitch from '../components/RangerSwitch.vue';
import RangerButton from '../components/RangerButton.vue';
import TeamController from '../imports/TeamController.js';

var teamController = new TeamController();
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
    RangerSwitch,
    RangerButton,
  },
  methods: {
    onDragStart(){
      this.trace = false;
    },
  	move(e){
        this.currentCenter = this.$refs.map.mapObject.getCenter();
    },
    onSuccess(e){
      console.log(e.coords.latitude + " / " + e.coords.longitude);

    	this.marker.lat = e.coords.latitude;
    	this.marker.lng = e.coords.longitude;
      
      if(this.trace)
        this.$refs.map.mapObject.setView(this.marker, 17);

    	// this.$refs.myLoc.mapObject.setLatLng(this.marker)

    	this.location = e.coords;
    },
    onError(e){
        console.log(e.code);
        console.log(e.message);
        console.log("----------");
    },
    traceChange(e){
      
      if(this.tracer === null)
      {
        this.tracer = navigator.geolocation.watchPosition(this.onSuccess, this.onError, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
        return;
      }

      navigator.geolocation.clearWatch(this.tracer);
      this.tracer = null;

    },
    onClickedSelfMarker(e){
      this.$refs.map.mapObject.setView(this.marker, 17);
      setTimeout(() => {
        this.trace = true;
      }, 100);
    },
    updateMarkers(){
      teamController.updateData().then(response => {
        this.markers = response;
      });
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
	    attribution: '',
	    marker: L.latLng(50.029206, 19.875053),
      trace: false,
      tracer: null
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
    let map = this.$refs.map.mapObject;
  	map.attributionControl.setPrefix('');
    map.removeControl(map.zoomControl);
  },
  created(){

  }
};
</script>

<style lang="sass">
$footHeight: 40px
$controllsHeight: 30px

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
  padding: 0

.info
	height: $footHeight
	bottom: 0px
	position: absolute
	width: 100%
	left: 0px
	box-sizing: border-box
	padding: 5px

.controlls
  z-index: 100000
  height: $controllsHeight
  bottom: $footHeight
  position: absolute
  width: 100%
  left: 0px
  background-color: #000
.team-marker
  .caption
    color: #fff
    position: absolute
    width: auto !important
    padding: 2px 5px
    left: 12px
    top: -9px
    border-radius: 3px
    box-shadow: 0px 2px 1px rgba(0,0,0,0.3)
    text-shadow: 0px 1px 0px rgba(0,0,0,0.3)
    opacity: 0.9

    &:before
      content: ''
      width: 5px
      height: 5px
      box-shadow: 0px 1px 2px rgba(0,0,0,0.4)
      //border: 1px solid #000
      position: absolute
      background-color: inherit
      border-radius: 50%

      top: 9px
      left: -12px

</style>