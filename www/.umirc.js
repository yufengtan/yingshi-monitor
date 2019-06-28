
// ref: https://umijs.org/config/
const admin = 'http://127.0.0.1:8100/'
export default {
  treeShaking: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: { webpackChunkName: true },
      title: 'www',
      dll: true,

      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
  history: 'hash',
  proxy: {
    context: path => {
      if (!path.startsWith('/api')) {
        return false
      }
      console.log(`Proxy to ${admin} PATH ${path} `)
      return true
    },
    target: admin,
    changeOrigin: true
  },
}
