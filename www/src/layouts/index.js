const { width } = window.screen
if (width !== 1920) {
  document.documentElement.style.fontSize = width / 1920 * 112.5 + 'px'
}

function BasicLayout(props) {
  return <div>
    {props.children}
  </div>
}

export default BasicLayout
