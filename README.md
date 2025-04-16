# dank_bank
Welcome to the Dank Bank!

This is a simple website for tracking things that I may or may not consider dank
The layout is quite simple

    - No login required : this is for me to share with the public. They don't need to log in to anything for that.

    - Single view
        > To start with, everything will be displayed on a single page.
        > There will be a table with filter and sorting options
            .. Data and Columns displayed will be determined by a Clickable that has X options
            .. Width is 2/3 screen (or 100% on mobile)
                -- other 1/3 will display details if you click on table row (or modal on mobile)

    - Additional views:
        > (potentially) modal view for mobile details
        > Form for adding entries
            - 1 view, Clickable with X options determines form template

Models : 

Restaurants
Restaurant Foods
Music
Travel
++++++
Anime
Games
Recipes
etc...

API : 

For each model:
    get all
    get single
    post entry
    update entry
    delete entry

We should be able to take advantage of some gemerics since all of the models will share api actions. Nothing custom needed at this time.
