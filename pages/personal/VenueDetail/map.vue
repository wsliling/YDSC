<template>
	<view>
		<map
		      id="map"
		      :longitude="Lng"
		      :latitude="Lat"
		      scale="15"
		      :markers="markers"
		      bindmarkertap="markertap"
		      bindregionchange="regionchange"
		      show-location
		      style="width: 100%; height: 100vh;"
		    ></map>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				Lat:'',
				Lng:'',
				markers: []
			}
		},
		onLoad(e) {
			// #ifdef APP-PLUS
			this.Lat=e.Lat;
			this.Lng=e.Lng;
			// #endif
		},
		onShow(){
			// #ifndef APP-PLUS
			this.Lat=this.$root.$mp.query.Lat;
			this.Lng=this.$root.$mp.query.Lng;
			// #endif
			this.markers=[{
            id: 0,
            latitude: this.Lat,
            longitude: this.Lng,
            width: 20,
            height: 20
          }];
		 
		},
		methods: {
			regionchange(e) {
			    console.log(e.type)
			  },
			  markertap(e) {
			    console.log(e.markerId)
			  },
		}
	}
</script>

<style>

</style>
