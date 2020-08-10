import Node from '@/api/models/Node'
import StaticValueNode from './StaticValueNode/index'
import MultiplicationNode from './MultiplicationNode/index'

export interface NodeModule {
  shape: any;
  menuItem: any;
  configPanel: any;
  class: typeof Node;
}

export interface NodeModules {
  [moduleName: string]: NodeModule
}

const modules: NodeModules = {
  StaticValueNode,
  MultiplicationNode
}

export default modules
