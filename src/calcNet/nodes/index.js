import StaticValueNode from './StaticValueNode/StaticValueNode'
import StaticValueNodeShape from './StaticValueNode/Shape'
import StaticValueNodeMenuItem from './StaticValueNode/MenuItem'
import MultiplicationNode from './MultiplicationNode/MultiplicationNode'
import MultiplicationNodeShape from './MultiplicationNode/Shape'
import MultiplicationNodeMenuItem from './MultiplicationNode/MenuItem'

export default {
  StaticValueNode: {
    shape: StaticValueNodeShape,
    menuItem: StaticValueNodeMenuItem,
    class: StaticValueNode
  },
  MultiplicationNode: {
    shape: MultiplicationNodeShape,
    menuItem: MultiplicationNodeMenuItem,
    class: MultiplicationNode
  }
}
