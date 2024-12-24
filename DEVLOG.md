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

        LATER : Research~
        - best way to set up tag mapping for multiple tables

    > Added choices for Music url types
    > Tables/Models structure set for now, need to fix fixture for data import

    Having a bit of trouble making sure database is set up properly with all correct tables and fields
        .. found it, there was a mismatch between models.py and serializers.py, so table wasn't being picked up

    Had to rebuild the app because migration tracking got messed up. Renamed app to api_dank
    Adding foreign key columns caused double _id in naming ("music_id_id")
        -- removing "_id" from model name fixed issue. I guess Foreign Key fields automatically have _id appended.

    Still having some issues with loading data. Need to do some more work on this.

12/24/2024
- Finish database setup and loading initial data fixture 
    > successfully loaded fixture
        - few inconsistencies with fields
        - enabled null on association table foreign keys
- Test API endpoints
    > All of the models have appropriate actions available

    LATER : Experiment with different model structures for many-to-many relations (tags, images)
        > Can try ManyToMany model

Need to create some custom API endpoints
    ViewSet actions?
