# Vote on Course Ideas

Once people submit their ideas, you get to vote! Would you take the course? Would you teach the course! Have you taken it before, and would recommend it?

## Cast a vote

We want to talk about a specific user's relationship to a course idea. So we define a fact that represents that relationship.

```JavaScript
var relationship = {
    type: "ImprovingU.IdeaConsumer",
    idea: idea,
    consumer: user
};
```

Having this relationship will let us watch for votes from a specific user. This will come in handy when showing a user whether or not they have voted on an idea themselves.

To cast a vote, the user issues a fact. For example, to vote that I would take a course:

```JavaScript
j.fact({
    type: "ImprovingU.TakeVote",
    from: user,
    createdAt: new Date(),
    ideaConsumer: {
        type: "ImprovingU.IdeaConsumer",
        idea: idea,
        consumer: user
    }
});
```

See the `from` field? That means that only the authorized user can create it. The distributor will reject any counterfeits.

Also pay attention to the `createdAt` field. The purpose is not really to record the current time: we can't trust the browser's clock. Actually, the purpose is to make sure that votes are unique. Without that, every vote by the same user for the same idea would be ... the same. We need them to be different because we can rescind a vote.

## Rescind a vote

People make mistakes. Let's give them a take-back.

```JavaScript
j.fact({
    type: "ImprovingU.RescindVote",
    from: user,
    vote: vote
});
```

Let's write a template function that tells us if a vote has been rescinded.

```JavaScript
function voteIsNotRescinded(v) {
    return j.not({
        type: "ImprovingU.RescindVote",
        vote: v
    });
}
```

Now we can use this template function as a condition to count only the votes that have not been rescinded.

## Count votes

How many people have voted for a particular idea? Let's find out.

```JavaScript
function IdeaViewModel(idea) {
    var ideaViewModel = {
        title: idea.title,
        takeCount: ko.observable()
    };
    j.watch(idea, [takeVotesForIdea],
        increment(ideaViewModel.takeCount),
        decrement(ideaViewModel.takeCount));
    return ideaViewModel;
}

function increment(value) {
    return function (v) {
        value(value() + 1);
    };
}

function decrement(value) {
    return function (v) {
        value(value() - 1);
    };
}

function takeVotesForIdea(i) {
    return j.where({
        type: "ImprovingU.TakeVote",
        ideaConsumer: {
            type: "ImprovingU.IdeaConsumer",
            idea: i
        }
    }, [voteIsNotRescinded]);
}
```

Have I voted for a particular idea? Let's see.

```JavaScript
function IdeaViewModel(idea) {
    var ideaViewModel = {
        ...
        takeVotes: ko.observableArray()
    };
    var ideaConsumer = {
        type: "ImprovingU.IdeaConsumer",
        idea: idea,
        consumer: user
    };
    j.watch(ideaConsumer, [takeVotesForIdeaConsumer],
        addTo(ideaViewModel.takeVotes),
        removeFrom(ideaViewModel.takeVotes));
    return ideaViewModel;
}

function takeVotesForIdeaConsumer(ic) {
    return j.where({
        type: "ImprovingU.TakeVote",
        ideaConsumer: ic
    }, [voteIsNotRescinded]);
}
```

If the `takeVotes` array is not empty, then I've voted for the idea. It's possible that I might have voted for the idea more than once (with different `createdAt` times). If so, they will all be in this array.

I can rescind all these votes all at once:

```JavaScript
j.fact({
    type: "ImprovingU.RescindVote",
    from: user,
    vote: ideaViewModel.takeVotes()
});
```
