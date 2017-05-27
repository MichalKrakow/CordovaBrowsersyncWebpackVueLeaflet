var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: './src/js/index.js',
	output: {
		path: __dirname + "/www/js",
		filename: 'index.js'
	},
	module: {
		rules: [
			// {
			// 	test: /\.css$/,
			// 	use: [
			// 		'style-loader',
			// 		'css-loader'
			// 	]
			// },
			{
				test: /\.s[ac]ss$/,
				use: ExtractTextPlugin.extract({
					use: [
						'css-loader',
						'sass-loader'
					],
					fallback: 'style-loader'
				})
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					extractCSS: true,
					loaders: {
						scss: ExtractTextPlugin.extract({
			              use: [
								'css-loader',
								'sass-loader'
						  ],
			              fallback: 'vue-style-loader' // <- this is a dep of vue-loader, so no need to explicitly install if using npm3
			            })
						//scss: 'vue-style-loader!css-loader!sass-loader', // <style lang="scss">
						//sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax' // <style lang="sass">
			    }
			  }
			},
			{
				test: /\.(png|jpg)$/,
				loader: 'file-loader',
				options: {
					name: '../images/[name].[ext]'
				}
			},
			{
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader?name=../fonts/[name].[ext]'
            }			
		]
	},
	resolve: {
	    alias: {vue: 'vue/dist/vue.js'}
	},
	plugins: [
		new CopyWebpackPlugin([
			{ from: 'src/index.html', to: '../index.html' },
		]),
		new ExtractTextPlugin('../css/app.css')
	]

}

if(process.env.NODE_ENV === 'production'){
	module.exports.plugins.push(
		new webpack.optimize.UglifyJsPlugin()
	);
}