import { NodeModule } from '../index'
import nodeClass from './MultiplicationNode'
import shape from './Shape.vue'
import menuItem from './MenuItem.vue'
import configPanel from './ConfigPanel.vue'

const module: NodeModule = {
  shape,
  menuItem,
  configPanel,
  class: nodeClass
}

export default module
