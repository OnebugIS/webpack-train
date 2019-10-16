const dev = require('./webpack.dev')
const prod = require('./webpack.prod')
const path = require('path')
const merge = require('webpack-merge')  // 合并配置文件
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')  // 默认导出是对象，所以需要引入是括号
module.exports = (env) => { // env 是环境变量
  // console.log(env) // { development: true }
  let isDev = env.development
  const base = {
    entry: path.resolve(__dirname, '../src/index.js'),
    module: {
      // 转化什么文件 用什么去转，使用哪些loader
      // loader三种写法 [] {} ''
      rules: [
        {
          test: /\.css$/,
          // use: ['style-loader', 'css-loader']
          // 如果.css里引入了.sass，则需要额外进行配置
          use: ['style-loader', {
            loader: 'css-loader',
            options: {  // 给loader传递参数
              importLoaders: 1 // 从后面引入第一个loader
            }
          }, 'sass-loader']
        },
        { // 匹配scss结尾的使用sass-loader来调用node-sass(默认去调))处理sass文件
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader']
        },
        {
          test: /\.less$/,
          // use: ['style-loader', 'css-loader', 'less-loader']
          // 第二种写法
          loader: "style-loader!css-loader!postcss-loader!less-loader"
        }
      ]
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, '../dist')
    },
    plugins: [
      // 在每次打包之前 先清除dist目录下的文件
      new CleanWebpackPlugin(), // 和 rm -rf ./dist一样
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, '../public/index.html'),
        filename: 'index.html',
        minify: !isDev && {  // 压缩
          removeAttributeQuotes: true, // 去掉双引号
          collapseWhitespace: true // 变为一行
        }
      })
    ]
  }
  if (isDev) {
    return merge(base, dev)
  } else {
    return merge(base, prod)
  }
  
}

