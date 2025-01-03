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

12/25/2024
Let me take another look at model structures.

1: Separate table per model, association tables have several columns
    Pros:
        Data integrity
        Easy to do separate API calls
    Cons:
        Association tables need a column for each model
            or a separate table for each association?

2: Single table with all models, association tables have 2 columns
    Pros:
        Everything stored in a single table
        Association table only needs item_id, assoc_id
    Cons:
        Include category in Item table, need to include when query


3: Polymorphic table - single table with common columns, separate tables with unique columns
    Pros:
        All items are stored in a single table
        Association table only needs item_id, assoc_id
        Data integrity
    Cons:
        Complex queries (need to do an extra join based on first query)
        Many tables (separate per model + 1 common)

So, realistically data integrity is not a major concern for me due to nature of project 
While I should also practice #1 and #3, I will go ahead with #2 for this app
Keep It Simple, Stupid. (next apps will use methods 1 and 3 for more practice)

12/26/2024
Today we'll go ahead and implement the Single Table db structure.
Currently it is set up for #1, we can keep this to the side for v2 practice
This should impact - models, serializers, views, urls

> Created Item model
    Updated serializers, views, urls

> Updated csv.json for new Item model, loaded fixture
> Update viewsets to filter Item table by category

OK So let's think about what our api endpoints are.

Get: All Items
Get: Items in Category
Get, Add, Update, Remove: single Item
Get, Add, Update, Remove: images
Get, Add, Update, Remove: tags
Get, Add, Remove: image association (image2item)
Get, Add, Remove: tag association (tag2item)

From what I gather, we want a separate view for each API call
We should have these set up, so now we need to work on building a front-end to call this API.

Now, let's create a next.js app to give us some frontend to call our API.
Next.js will be great because we can leverage its server-side rendering to load tables/images faster

12/27/2024
Today:
    Continue working on Next.js application

    So currently, we have the basic setup. What we need to do next is actually build some front-end html.
    The basic version of this website should be quite simple:
    Views:
        1. Welcome Page - Generic welcome. No auth necessary at this point.
        2. Main Page - This will contain a table, details, and a few buttons
            Buttons will be used to filter the table by category 
            Also button for adding a new item 
        3. New Item Form - Potentially Modal?
            Allow you to choose a category, then populates appropriate input fields
        3.5 > New Item Form can also be used as basis for Update Item Form
        4. Delete Item 
            I don't think we need a whole view for this? But should have a confirmation form.

    For front-end, we will need:

    1. Simple Welcome Page 
    2. Simple main page (table with loading)
    3. Delete Item 
    4. New Item Form

    For today, I'm going to do a bit of research on integrating Django with NextJs
    It's definitely not a "waste of time" to just start building and figure it out later 
    But I would like to be sure in my approach so I'm not doing unnecessary work.

    From what I can tell, it looks like I will create a NextJs app same as usual
    Main difference will be in app/api/route.ts, I call my Django API rather than build NextJs query
    Which can be done by setting getApiClient() to my DRF API URL (localhost for now)

    LATER : look into using django_filters to further customize API queries
    (https://stackoverflow.com/questions/50370692/custom-query-for-django-rest-framework)
    ALSO : DRF - Requests (https://www.django-rest-framework.org/api-guide/requests/)

    MAYBE : need to look into strength of adding custom methods and actions to ViewSet

    Take a look at dis : https://github.com/QueraTeam/django-nextjs
                         https://medium.com/@danialkeimasi/django-next-js-the-easy-way-655efb6d28e1

                         https://github.com/unfoldadmin/turbo
                         (Plenty of details in the README)

    Random but side benefit of using DRF + Next, DRF api will be reusable for other apps

    LATER : Django-Ninja appears to be a pretty good solution 

1/3/2025:
    Welcome back from New Years vacation! Today we will work on making our front-end Next JS app 

    next.js app : next_dank

    + public //static resources  // use next/image to optimize images using <Image> component
        + hero-desktop.png
        
    + app/
        + lib/
            + definitions.ts
        + ui/                           # This directory is for ui components
            + global.css
            + fonts.ts
            + dankbank-logo.tsx
            + dankbank-logo-sidenav.tsx **** Need to fix up how the logo looks
            + items/
                + category.tsx
            + dashboard/
                + sidenav.tsx           **** Need to fix up how the logo looks
            + nav-links.tsx             # Use next/link:<Link> instead of <a> for optimized routing
                                        # Use next/navigation:{usePathname} to know current path 
        + dashboard/                    # This directory is for routing (important : layout.tsx, page.tsx)
            + page.tsx
            + layout.tsx
            + items/
                + dining/
                    + page.tsx
                + food/
                    + page.tsx
                + music/
                    + page.tsx
                + travel/
                    + page.tsx

        + layout.tsx
        + page.tsx

    + import clsx [https://www.npmjs.com/package/clsx] - library to toggle css class names based on condition
    + pnpm i @vercel/postgres
