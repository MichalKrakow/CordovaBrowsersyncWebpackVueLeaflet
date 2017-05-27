<template>
	<div class="component" :class="{on: state}"  @touchend="toggle">
		<span><slot></slot></span>
			<div>
				<span></span>
			</div>
	</div>
</template>

<script>
export default {

  name: 'RangerSwitch',
  model: {
    prop: 'checked',
    event: 'change'
  },
  data () {
    return {
    	state: this.checked
    };
  },
  props: {
  	checked: { required: true }
  },
  methods: {
  	
  	toggle(){
  		navigator.vibrate(50);
  		this.state = !this.state;
  		this.$emit('change', this.state);
  	}
  }
};
</script>

<style lang="sass" scoped>

$red: #c00;
$outHard: cubic-bezier(0.230, 1.000, 0.320, 1.000);

.component
	display: inline-block
	padding: 5px
	background-color: #000
	height: 20px

	&>span
		display: inline-block
		font-size: 12px
		vertical-align: middle
		color: $red
		margin-top: 3px

	div
		display: inline-block
		width: 30px
		height: 20px
		border-radius: 1px
		border: 1px solid $red
		box-sizing: border-box
		vertical-align: middle
		position: relative
		
		span
			position: absolute
			top: 1px
			left: 1px
			background-color: darken($red, 20%)
			display: block
			width: 16px
			height: 16px
			transition: left 0.2s $outHard

	&.on>div>span
		background-color: $red
		left: 11px
	
	// &:active>div>span
	// 	background-color: darken($red, 5%)


</style>