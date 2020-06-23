const logger = requireRoot("/lib/logger");
const vm = require('vm');

const rules = `

  console.log(nappali_elol.Name);

  nappali_elol.on("event.button", function(mode) {
    if (mode == "short")
    {
      nappali_elol.cmd("power", "on");
      nappali_hatul.cmd("power", "on");
      //nappali_elol.ack("mid");
    }
    else if (mode == "long")
    {
      nappali_elol.cmd("power", "off");
      nappali_hatul.cmd("power", "off");
      //nappali_elol.ack("low");
    }
    // nappali_elol.cmd("power", "on");
    // createTimeout("nappali_elol_after_2sec", 5000, () => { nappali_elol.cmd("power", "off"); });

    // if (nappali_elol.stat("power") == "off")
    // {
    //   nappali_elol.cmd("power", "on");
    //   nappali_hatul.cmd("power", "on");
    //   nappali_elol.ack("mid");
    // }
    // console.log("Mode: " + mode);
  });

  kisfahaz.on("event.button1", function(mode) {
    kisfahaz.cmd("power1", "on");
    createTimeout("kisfahaz_power1_after_6sec", 6000, () => { kisfahaz.cmd("power1", "off"); });
  });
  kisfahaz.on("event.button2", function(mode) {
    kisfahaz.cmd("power2", "on");
  });


  nappali_elol.on("stat.power", function(currentstate) {
    console.log("Power: " + currentstate);
    console.log("Power: " + nappali_elol.stat("power"));
  });

  // setInterval(function()
  // {
  //   console.log("Power: " + nappali_elol.stat("power"));
  // }, 5000);

  console.log("end");

`;


class RunningContext {
  _timers = {};
  _intervals = {};
  _devicestates = [];

  CreateTimeout(name, timeout, func) {
    if (this._timers[name])
      clearTimeout(this._timers[name]);

    const id = setTimeout(func, timeout);
    this._timers[name] = id;

    return id;
  }

  CreateInterval(name, timeout, func) {
    if (this._intervals[name])
      clearInterval(this._intervals[name]);

    const id = setInterval(func, timeout);
    this._intervals[name] = id;

    return id;
  }

  async Run(devicestates) {
    this._devicestates = devicestates;

    let contextvars = {};
    contextvars["setInterval"] = this.CreateInterval.bind(this);
    contextvars["createTimeout"] = this.CreateTimeout.bind(this);
    for (var key in devicestates)
      contextvars[key] = devicestates[key];

    try {
      const jscode = await requireRoot("/models/RuleCode").FindLastJsCode() || "";

      const context = vm.createContext(contextvars);
      new vm.Script(jscode).runInContext(context);

      return null;
    }
    catch (err) { console.log(err); return err.stack; }
  }

  Stop() {
    for (var key in this._devicestates)
      this._devicestates[key].ReleaseListeners();

    Object.keys(this._timers).forEach(function (key) {
      clearTimeout(this._timers[key]);
    });

    Object.keys(this._intervals).forEach(function (key) {
      clearInterval(this._intervals[key]);
    });
  }
}

module.exports = RunningContext;
