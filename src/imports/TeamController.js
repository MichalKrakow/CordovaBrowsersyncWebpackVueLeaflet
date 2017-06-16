import Vue2Leaflet from 'vue2-leaflet';

export default class TeamController {
		constructor(){

		}

		updateData(markers) {
			return new Promise((resolve, reject) => {

		        axios.post('http://192.168.0.101:8080/getusers', this.$data)
		        .then(response => {
		            let marks = [];
		            for(let marker of response.data)
		            {
		                let ob = {
		                    'id' : marker.id,
		                    'name' : marker.name,
		                    'color' : marker.color,
		                    'position' : marker.positions[0],
		                    'show' : true,
		                    'polyline' : {
		                        latlngs: marker.positions.map(loc => {
		                            return [loc['lat'],loc['lng']];
		                        }),
		                        color: marker.color
		                    },
		                    'icon' : L.divIcon({
		                            className: 'team-marker',
		                            'html' : `<div class="caption" style="background: ${marker.color}">${marker.name}</div>`,
		                            'iconAnchor' : [3,3]
		                    }) 
		                }
		                marks.push(ob);
		                resolve(marks);
		            }
		        });
	    	});
	    }
	}