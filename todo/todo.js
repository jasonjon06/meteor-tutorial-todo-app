Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
    /* Part 1: Retrieve list of tasks
    (1) Helpers is where we pass data to our templates. We define our helpers in a dictionary. In this example,
        the key "tasks" contains an array of dictionaries.
    (2) List containing dictionaries with one key, 'text', with its corresponding value.
    */
    Template.body.helpers({  // (1)
        "tasks": [  // (2)
            {text: "This is task 1"},
            {text: "This is task 2"},
            {text: "This is task 3"}
        ]
    });

    /* Part 2: Retrieve documents in MongoDB's Collection
    (1a) As compared to the prev. example, we now retrieve our tasks in the `Tasks` collection using the `find` method.
    (1b) Sort tasks by the latest 'createdAt' attribute. More info with regards to Mongo.Collections' find option
         can be found on this link: http://docs.meteor.com/#/basic/Mongo-Collection-find
    */
    Template.body.helpers({
        "tasks": function () {
            // return Tasks.find({});  // (1a)
            return Tasks.find({}, {sort: {createdAt: -1}});  // (1b)
        }
    });

    /* Part 3: Adding Tasks with a form
    (1) We attach event handlers the same way we attached our helpers - in the `Template.templateName` with a dictionary.
    (2) The dictionary key should describe to the event to listen for. In this case, we would be listening to the
        submit event of any element that maches the CSS selector `.new-task`.
    (3) Inserts the retrieved text to the `Tasks` collection using Mongo.Collection's `insert` method. More info with
        regards to Mongo.Collections' insert method can be found on this link: http://docs.meteor.com/#/basic/Mongo-Collection-insert
    */
    Template.body.events({  // (1)
        "submit .new-task": function (event) {  // (2)
            event.preventDefault();
     
            var text = event.target.text.value;
       
            Tasks.insert({  // (3)
                text: text,
                createdAt: new Date()
            });
       
            event.target.text.value = "";
        }
    });

    /* Part 4: Checking off and deleting tasks
    (1) We now attach an event to the 'task' template. These events are for checking off and/or deleting an item.
        Inside each event handler, 'this' refers to an individual Task object, and each object in a collection
        has a unique '_id' field.
    (2) The 'update' function needs 2 arguments: First is the selector which will identify the subset of the collection,
        and second is the update parameter that specifies what should be done to the matched objects. More info with
        regards to Mongo.Collections' update method can be found on this link: http://docs.meteor.com/#/basic/Mongo-Collection-update
    (3) The 'checked' attribute is the one checked in the template to determine the todo list item's status.
    (4) The 'remove' function only needs the selector to determine which item(s) in the collection are to be deleted.
        More info with regards to Mongo.Collections' remove method can be found on this link: http://docs.meteor.com/#/basic/Mongo-Collection-remove   
    */
    Template.taskwithcheckanddelete.events({  // (1)
        "click .toggle-checked": function () {
            Tasks.update(this._id, {  // (2)
                $set: {checked: !this.checked}  // (3) 
            });
        },
        "click .delete": function () {
            Tasks.remove(this._id);  // (4)
        }
    })

    /* Extra: Editing task
    (1) On submission of the textfield within the row, it updates the current text of a specific document with
        the one inside the textfield. The same code snippet is used when checking/unchecking a task, except we
        are updating the text attribute of the document.
    (2) Displays a textfield on click to be able to update currently selected task's text.
    */
    Template.taskwithoptions.events({
        "click input[type=checkbox].toggle-checked": function () {
            Tasks.update(this._id, {
                $set: {checked: !this.checked}
            });
        },
        "submit .edit-task": function (event) {  // (1)
            event.preventDefault();

            var inputText = event.target.children[1];
            var span = event.target.children[2];

            Tasks.update(this._id, {
                $set: {text: inputText.value}
            });

            inputText.value = "";
            inputText.hidden = !inputText.hidden;
            span.style.visibility = inputText.hidden ? 'visible' : 'hidden';
        },
        "click button.edit": function (event) {  // (2)
            event.preventDefault();

            var inputText = event.target.parentNode.children[1];
            var span = event.target.parentNode.children[2];
            inputText.hidden = !inputText.hidden;
            span.style.visibility = inputText.hidden ? 'visible' : 'hidden';
        },
        "click button.delete": function (event) {
            event.preventDefault();

            Tasks.remove(this._id);
        }
    });
}
