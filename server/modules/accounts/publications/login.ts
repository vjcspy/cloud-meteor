// Publish the current user's record to the client.
Meteor.publish(null, function() {
  if (this.userId) {
    return Meteor.users.find(
      {_id: this.userId},
      {fields: {profile: 1, username: 1, emails: 1, roles: 1}});
  } else {
    return null;
  }
}, /*suppress autopublish warning*/{is_auto: true});