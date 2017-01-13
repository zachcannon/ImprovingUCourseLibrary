### Mutable properties

A user group has a name. Define that as a mutable property inside of the UserGroupViewModel constructor:

```JavaScript
this.name = new jko.Mutable('MyApp.UserGroup.Name', userGroup, '');
```

The first parameter is the type of the fact representing the mutable property's value. Use the convention
`Application.Entity.Property`.

The second parameter is the entity fact itself.

The third parameter is the default value of the property. Use this to indicate the type of the property.
Use `''` for strings, `0` for numbers, `{}` for objects, or 'null' for nullable objects.

*Take a peek [under the covers](https://github.com/michaellperry/jinaga.app.client/blob/master/Mutable.md).*

### Watching mutable properties

Create a function to watch for facts matching the generated template functions. Define this on the
UserGroupViewModel prototype:

```JavaScript
UserGroupViewModel.prototype.watch = function () {
  this.name.watch();
};
```

As you add new Mutables to the class, add a call to their `watch` function as well.

Call this function after you create the UserGroupViewModel in the MainViewModel constructor:

```JavaScript
this.userGroup.watch();
```

### Binding to mutable properties

Back in the HTML, you'll want to bind to the `userGroup` property of the main view model. Then inside
of that block, bind to the `name` mutable property. The `value` sub-property gives you access to the
current value.

```HTML
<div data-bind="with: userGroup">
  <input type="text" data-bind="value: name.value">
</div>
```

Keep the back end running as you build the app. You can test it now by simply refreshing the page. Change
the user group's name, tab out, and refresh to see that it was persisted. Open the page in another browser,
and see that it updates on one browser when you change it in the other.

