schema.methods.can = function (action, resource) {
	if (!this.roles || this.isDeleted) return false;
	if (this.roles === 'superadmin') return true;
	if (!this.grants) return false;
	if (!this.grants[resource] || this.grants[resource].length === 0) return false;
	if (this.grants[resource].indexOf(action) > -1) return true;
	return false;
};