new ValidatedMethod({
  name: 'user.send_email',
  validate: function () {
  },
  run: function (to, from, subject, text) {
    check([to, from, subject, text], [String]);
    this.unblock();
    Email.send({ to, from, subject, text });
  }
});