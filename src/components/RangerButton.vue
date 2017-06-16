<template>
	<div class="component" :class="{touched: touched}" @touchstart="touched=true" @touchend="activate">
		<div><slot></slot></div>
	</div>
</template>

<script>
export default {

  name: 'RangerButton',

  data () {
    return {
    	touched: false
    };
  },
  methods: {
  	activate(){
  		navigator.vibrate(50);
  		this.touched = false;
  		this.$emit('touchend', true);
  	}
  }
};
</script>

<style lang="sass" scoped>
@import "../sass/colors.sass";

.component
	display: inline-block
	padding: 5px
	background-color: #000
	height: 20px

	div
		display: inline-block
		width: auto
		height: 20px
		border-radius: 1px
		border: 1px solid $red
		box-sizing: border-box
		vertical-align: middle
		position: relative
		font-size: 12px
		padding: 2px 10px

	&.touched>div
		background-color: #fff
		color: #000

</style>