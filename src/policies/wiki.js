const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {
  _isOwner() {
    if (!this.user) {
      return false;
    } else {
      return this.record && (this.record.userId == this.user.id);
    }
  }

  show() {
    if (!this.user) {
      return false;
    }
    if (this.record.private == true) {
      return this.record.isCollaborator(this.user.id) || this._isOwner() || this._isAdmin();
    } else {
      return true;
    }
  }
  edit() {
    if (this.record.private == true) {
      return this.record.isCollaborator(this.user.id) || this._isOwner() || this._isAdmin();
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