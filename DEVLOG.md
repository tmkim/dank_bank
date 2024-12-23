# Development Log

12/21/2024
- Initialize project
- Start building API
- Set up project settings, database, initial project urls
- Set up initial models for:
    [Restaurants, Food, Music, Travel // Tags, Tags2Entry]
        > Each entry can be associated to tags - may choose existing or create new
        > this will help with searchability and browsability
- Set up serializers
- Set up generic view sets
- Set up api urls with router

TODO LATER : Look into best way to implement tagging system
TODO LATER : Look into benefit of hyperlinking (performance)

--- At this point, basic API is set up for a few models

TODO : 
        Build some entries, populate database
        Set up proper testing

12/22/2024
- Build some entries, populate database
    > Let's start by using a simple fixture to populate one or two entries per model 
    > Then we can build a Next.js app to build forms that use api to populate db 
    
    > Made some progress building test entries and fleshing out data models 

12/23/2024
- Finish setting up test db fixture + import data 
    > Should I implement polymorphic tables instead of keeping them separate?
        Pros:
            aggregates all entries into single table
            easy to associate tags and images by entry_id
        Cons:
            more complex queries (have to grab category, then query appropriate table)
            risk data integrity

        I think for this project I will skip using polymorphic tables
        This database is not complex enough to justify it
        But I have prepared models for both so I may test later

    > Added choices for Music url types
    > 
    

- test API endpoints
