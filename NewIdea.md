# Submit Course Ideas

Course ideas live within a hierarchy. The company has many offices. Each office will offer many semesters. An idea is submitted within the scope of a semester. Let's define that hierarchy of facts.

```JavaScript
var semester = {
    type: "ImprovingU.Semester",
    name: "Spring 2016",
    office: {
        type: "ImprovingU.Office",
        name: "Dallas",
        company: {
            type: "ImprovingU.Company",
            name: "Improving"
        }
    }
};
```

Notice how the hierarchy is upside-down - at least from the perspective of document modeling. Each fact refers to its predecessor.

## Submit an idea

To submit a course idea, authorized users create a document like this:

```JavaScript
j.fact({
    type: "ImprovingU.Idea",
    semester: semester,
    from: user,
    createdAt: new Date(),
    title: "Underwater basketweaving."
});
```

Create a form that takes a title and has a submit button. Data bind the form to an observable in the view model, and create the fact when the button is pressed. Go ahead and clear the title for good measure.

```JavaScript
var viewModel = {
    ...
    newIdeaTitle: ko.observable(),
    submitNewIdea: submitNewIdea
};

function submitNewIdea() {
    if (viewModel.newIdeaTitle()) {
        j.fact({
            type: "ImprovingU.Idea",
            from: viewModel.user(),
            createdAt: new Date(),
            title: viewModel.newIdeaTitle()
        });
        viewModel.newIdeaTitle("");
    }
}
```

## Display course ideas

Now display a list of course ideas. First write a template function that matches all ideas for a given semester.

```JavaScript
function ideasForSemester(s) {
    return {
        type: "ImprovingU.Idea",
        semester: s
    };
}
```

Then query for facts matching that template. Use them to update an observable array in the view model.

```JavaScript
var viewModel = {
    ...
    ideas: ko.observableArray()
};

j.watch(semester, [ideasForSemester], addTo(viewModel.ideas), removeFrom(viewModel.ideas));

function addTo(observableArray) {
    return function (fact) {
        observableArray.push(fact);
        return fact;
    };
}

function removeFrom(observableArray) {
    return function (fact) {
        observableArray.remove(fact);
    };
}
```

Bind the array to the view. Now when you add an idea, it appears on the UI. It also is sent to the server and stored. It also is sent to anybody else who happens to be running the app in real-time.