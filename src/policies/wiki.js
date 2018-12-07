const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {
  show() {
    if (this.record.private == true) {
      return this._isPremium();
    } else {
      return true;
    }
  }
  edit() {
    if (this.record.private == true) {
      return this._isPremium() && this.record;
    } else {
      return this.create() && this.record;
    }
  }
  update() {
    return this.edit();
  }
  destroy() {
    return this.update();
  }
}