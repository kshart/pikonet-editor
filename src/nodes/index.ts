import Node from '@/api/models/Node'
import StaticValueNode from './StaticValueNode/index'
import MultiplicationNode from './MultiplicationNode/index'
import Vue from 'vue'

export interface NodeModule {
  shape: typeof Vue;
  menuItem: typeof Vue;
  configPanel: typeof Vue;
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
