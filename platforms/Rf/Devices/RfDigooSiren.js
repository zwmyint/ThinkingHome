const RfDevice = require('../RfDevice')
const { Entity } = require('../../Entity')
const { ButtonAction } = require('../../Action')

class RfDigooSiren extends RfDevice {
  setting = {
    rfprefix: '',
    toDisplayList: function () {
      const result = {}
      result.rfprefix = {
        type: 'text',
        title: 'RF prefix (4 hex digit)',
        value: this.setting.rfprefix,
        error: !this.setting.rfprefix,
        canclear: true
      }
      if (this.setting.rfprefix) {
        result.rfsos = {
          type: 'label',
          title: 'SOS RF code',
          value: this.GetSOSCode()
        }
        result.rfdisarm = {
          type: 'label',
          title: 'Disarm RF code',
          value: this.GetDisarmCode()
        }
        result.sendsos = {
          type: 'button',
          title: 'Send SOS code',
          value: 'Learn or test',
          onexecute: function () {
            const sos = this.GetSOSCode()
            if (sos) {
              this.SendRfCode(sos)
            }
          }.bind(this)
        }
        result.senddisarm = {
          type: 'button',
          title: 'Send disarm',
          value: 'Make silence',
          onexecute: function () {
            const disarm = this.GetDisarmCode()
            if (disarm) { this.SendRfCode(disarm) }
          }.bind(this)
        }
      }
      return result
    }.bind(this),
    toTitle: function () { return 'Digoo Siren' },
    toSubTitle: function () { return this.GetSOSCode() }.bind(this)
  };

  GetSOSCode() {
    if (this.setting.rfprefix) { return `[433]${this.setting.rfprefix}88#24` }
    return null
  }

  GetDisarmCode() {
    if (this.setting.rfprefix) { return `[433]${this.setting.rfprefix}82#24` }
    return null
  }

  get icon() { return this.setting.icon || 'fa fa-volume-up' }
  entities = {
    alarm: new Entity(this, 'alarm', 'Alarm', 'fa fa-volume-up')
      .AddAction(new ButtonAction(this, 'alarm', 'Alarm', 'fa fa-volume-up', function () { if (this.device.GetSOSCode()) this.device.SendRfCode(this.device.GetSOSCode()) }))
      .AddAction(new ButtonAction(this, 'disarm', 'Disarm', 'fa fa-volume-mute', function () { if (this.device.GetDisarmCode()) this.device.SendRfCode(this.device.GetDisarmCode()) }))
  };

  GetStatusInfos() {
    const result = []
    if (!this.setting.rfprefix) result.push({ device: this, error: true, message: 'RF prefix not set' })
    return result
  }
}
module.exports = RfDigooSiren
