const Device = require('../Device')

class ZigbeeDevice extends Device {
  static GetTypes() {
    return {
      MiJiaLightSensor: { displayname: 'MiJia Light sensor', devicename: 'ieee_'.toLowerCase(), icon: 'fa fa-low-vision' },
      E1744: { displayname: 'Ikea E1744', devicename: 'ieee_'.toLowerCase(), icon: 'fa fa-tablets' }
    }
  }

  static CreateByType(type, id, platform, name) {
    try {
      const TypeClass = require('./Devices/' + type)
      return new TypeClass(id, platform, name)
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND') { throw new Error(`Unknown device type: ${platform.GetCode()}.${type}=${name}`) }
      throw err
    }
  }

  get icon() { return 'fa fa-hive' }

  SendMessage(topic, message) {
    this.platform.SendMessage(topic, message)
  }

  ProcessMessage(topic, message) { return false }
  ProcessMessageObj(topic, messageobj) { return false }
}
module.exports = ZigbeeDevice