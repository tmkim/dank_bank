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
        >> so I currently have node_modules in both /dank_bank/ and /dank_bank/frontend_dank
            It doesn't work if I just remove from frontend, but I'm not sure that's supposed to be there?
            either way i'm not sure if this is necessary when I start using my DRF api. So we'll save this for LATER

    *** Fetching data from DRF API in Next JS
        > const res = await fetch('API_URL', {cache: 'force-cache / force-dynamic'})    // force-cache is default
            -- Client side: use fetch with cached data
            -- Server side: use fetch with dynamic data
        ~~ If your Next.js app and DRF API are hosted on different domains, you might need to configure Cross-Origin Resource Sharing (CORS) on your API.

    TODO : work on fetching data from API to populate Items list https://nextjs.org/learn/dashboard-app/fetching-data

1/4/2025
    Today we will be focusing on correctly retrieving data from our API, and formatting it to populate a list in Next.js 

    So right now, we are able to interact with our api endpoint api_dank/items, but we need to format it properly for list usage
    Ahhh. I had to add "await" to res.json() call.
        - Realized this because my res.json() was returning a Promise rather than readable Json
        So now we're getting a data json with {count, next, previous, results}

    Aaand there we go! 
        Updated items/page.tsx to handle api response properly
        Make sure that ui/list-items.tsx is displaying a table with appropriate information
            LATER : work on formatting, make it pretty

    Alright, so we can go ahead and apply the same logic to our category pages
    I can reuse our list-items table since we would like to maintain the same format, just display different information
    Sick, we got basic lists out on all of our categories.

    So the way I am envisioning the website will look.
    We have our list covering the left portion of our window, and there is plenty of room to display title/category/rating.
    I want to make the table interactive, where you may click on an item and see further details on the right side.
        This will include details such as images, tags, review, etc depending on the category (this is already set up via models and what info is available to query)

    So I think the next things we need will be:
        Detail component (different per category? Might be able to resue some components)
        Form to post new items (similar to above?)

        I might be able to do something like reuse a component with clsx to determine which fields are available based on the category.
        I considered reusing the same component for Detail and Form, but they have different functions and should not look the same anyways.

        Extra : Format nav links to put categories as sub-tabs from Items expansion

        LATER : auth is unnecessary for viewing, require permission to add/change/remove items (I don't want strangers to be allowed)
                Add search and pagination

    OK so ............

    Let's make the detail component. I should be able to re-use a component from the tutorial?

        NOTE :  On desktop it makes sense to simply display the details on the right side of the page.
                However, on mobile, it would make more sense for it to be modal, or go to a new page.
                Since there will be no option to make changes when viewing details, modal should be safe.

        Alright I got a basic detail component down. Got a bit distracted with formatting my pages and tables.
        Still need to do more work on:
            -- Format things to look pretty
            -- Individualize details component
                >> Works for "Item" table
                -- Need to consider logic for passing different model types into Details component
            -- Details updates when an item from the table is clicked

    ACTUALLY. You know what. Now that I'm thinking through this more.

    I don't need to have separate pages/tables per category. I just need checkbox buttons to determine the filter.
    So let's just focus on our Items table which will simply be labeled as the Dank Bank.
    Since I already have everything set up as a single table, I should keep consistent and use a single large Item definition, using conditions to know which fields to show.
    LATER : in future, I can look at splitting it up into multiple tables or using multiple endpoints.
    Maybe I can call each API endpoint depending on the filters applied?
    Either way for now I want to keep everything within "Item".

    ** updated nextjs definition, api serializer

    TODO Tomorrow:
        Flesh out details for different categories
        Make it pretty
        Add search, pagination, filter
        Make table rows interactive

1/6/2025
    Thoughts regarding storing images:
        At this point, storing images in the public folder is sufficient for testing purposes.
        HOWEVER, I will want to move to blob storage when I actually deploy
            - allow me to upload images from the website
            - associating images to items using foreign keys

    Flesh out details for different categories
        - done
        ** updated Travel to include google map url
        ** updated Address in detail component to be Link using gmap url

    Make it pretty
        - uhhhhhhhhh

    Add search, pagination, filter
        - need to update API to accept parameters
            ** updated api views.py to include query and pagination 
            ** updated item table to accept query/pagination
        ** install django-cors-headers and update django settings.py
        
        ** Basic search, pagination working! 

1/7/2025
    OK so today we'll be fleshing out our table, search, pagination 
    Then we can start adding buttons
        - Filter buttons 
        - Create, Update, Delete 
    We will also need to make our Create and Update forms 

    ++ cleaned up table 
    ++ made table-details interactable
        ** need to add props to details to accept input from table
        ** table needs useState to handle row clicks and pick which item to pass
        .. since table and details are 2 separate components, 
                we need the OnClick logic in page.tsx so we can maintain the state for both comps
        .. We can pass our OnClick function to Table component 

1/8/2025
    ok so today our main focus should be : 
        - create form, update form
        - buttons
        - extra : "loading" text shifts table down -> don't do that
    
    Working on my create form
        > set up options to pull enumeration from Item definition
        > learn that switch/case > clsx when conditionally rendering components
            clsx is better for pure css
            ok to use both, depending on needs
            .. will need to update my details component

        ++ updated details to use switch/case for conditional rendering rather than clsx
        ++ set up basic create form with different input options depending on category
            > fields exist and will render depending on chosen category
            > need to make it pretty~

        ** edit form can copy the create form + parameter
            have information pre-populated based on input item
        > the specific item can be passed by an "edit" button

1/9/2025
    Alright today we will work on our update form + basic buttons
    First.. let's create an "update" button to add to our table.
        Working on making it modal
        ++ make edit form and update fields to listen for onChange
        .. apparently better for inputs to be string then convert to number later?
                -- LATER : will have to look into updating definition/model
        .. Basic set up of edit form is done, need to make some tweaks

    Need to work on formatting, but clicking on "Edit" button will display Modal edit form
        .. need to add funciontality to Update
            + update handleSubmit to PUT json using DRF api endpoint
    
    update item table to handle state of items list (important to listen for updates)

1/13/2025
    Welcome back boys let's get this dank 

    Alright so let's go through the current state of our app and see what needs work.
    We can separate this by what needs work - function vs format

    So taking a look at our main page with the items list..
        * Table displays list of items with pagination and search 
            -- something broke while updating our table :(
            So right now search/pagination do not update the table 
            I think this is because we updated how data is fetched
            -- need to make pretty

        * Clicking on an item will properly populate Details component 
            -- need to make pretty
        
        * Clicking edit button wil load Update Modal with prepopulated data
            -- update not updating
        
        * Create form will load appropriate input options per category 
            -- need to make pretty
            -- need to add verification for required fields?
            -- adding new item does not update database 
        
        * Need button for New Entry 
        * Need buttons for filter item table 

    FUNCTION --
        ~~ Item Table - pagination & search - need to update items displayed on table 
        >> Update Form - make sure updating details updates database 
                       - make sure new details appear in Item Table (without refresh)
        >> Create Form - make sure new entries are added to database
                       - make sure new entries display in Item Table (without refresh)
        ~~ Create Item button - open fresh Create form 
        ~~ Category filter buttons - determine which categories appear in Item Table 
                       ~~ need to add query functionality

    FASHION --
        Formatting : 
            Item Table
            Update Form
            Create Form
            Details 
            Side nav
            Overall 

    ++ Create Form turned into Modal
    ++ New Entry button to activate Create Modal
        .. "Cancel" works as expected
        *** need to add Create functionality
    ++ Added checkboxes as Category Filter Buttons
    ++ Made sure item table fetch() uses [page, query, limit] as dependencies
    ++ Update API to accept list of categories as query input

    .. Working on adding functionality to filter buttons to include category in API query
    .. Running into issue with infinite looping
        -- need to revisit how my states and useEffect are implemented
        -- basically my state changes are triggering effects that change states and trigger effects again
    .. also tried implementing lodash debounce but having trouble installing ?

1/15
    Ok, so today's first focus is fixing my infinite looping UseEffect() when applying filters

    -- quick fix "bug" where category filter wasn't working due to capitalization
    -- made category filter off by default : will show all results until a filter is added

    .. so right now, starting with all filters off, I can choose ONE filter without it breaking. URL is updated.
    -- deselecting the category will update the table but not the URL
    -- deselecting and reselecting the same category is ok
    -- selecting 2nd category causes infinite loop

    AWWW YEAH IT WORKS BROTHERRRR
    I just don't have to update my URL when filters are selected/deselected
    ++ confirmed that it work with searching

    Tomorrow --
        >>> Update Form - make sure updating details updates database 
                        - make sure new details appear in Item Table (without refresh)
        ++ Create Form  + make sure new entries are added to database
                        + make sure new entries display in Item Table (without refresh)
                        
1/16
    Create form is fully functional!

    Update form -- i'm getting a weird error when trying to update fields
                .. some fields just keep deleting whatever I type
                .. some fields change when I change other fields
                .. going to have to do a slight rehaul of update modal

1/22
    What's up chat, I had to step away for a bit to focus on interview preparations but i'm back!
    Today, the plan is simple -- we're going to make sure our update form works.
    If we have additional time, I believe we can start working on making things pretty?
        But of course, we'll do a run through to make sure our components are functional
        +++ need to improve field validation !
        Selects are not prepopulating correctly?
            > Categories good. Price Range and MSource, no.
        Rating also not pre-populating correctly
        

    WEEEEEEEEEEEELP
    Of course I was just importing the wrong component. Oopsie! Easy fix!
    Still, a few things are not populating as expected.

    Common - Rating
    Dining - Price Range
    Travel - Gmap
    Food - Cuisine
    Music - Source

1/23
    So let's take another look at our update form... Currently most things are populating except..

    - Dining Price Range
    - Food Cost -> Populating if exists, but Create isn't saving
    - Music Source
    - Rating

    OK~~~ From what I can see, we have full (basic) functionality set up!
    Item table good
    Searchable + Pagination + Filters good
    Details good
    Create, Update good
    
    !!! Need Delete !!!
    Delete has been implemented using a custom modal!

    and now we can work on formatting to make things look better.

1/24
    Alright, so I think we are set with basic functionality.
    Future work--
        Images
        Tags
        "admin auth" (have to log in to perform actions)
        Item table loading skeleton

    So let's look at formatting..

    DONE - Item Table Columns
    DONE / IN PROG - Create Form

    TODO - Item Table Skeleton
    TODO - Details layout
    TODO - Update Form
    TODO - Overall Page (especially when shrinking window)

1/27
    Time to continue on the above :)
    Today's focus -- Create Form, Update Form, Skeleton

    -- quick update to Items page to make display more reactive with custom media breakpoint
    -- updated Create Form:
            -- better placement of icons
            -- rating input turned into a slidebar
            -- price range turned into $ $ $ $ $
            -- increase font size

1/28
    work work
    Today's focus - update form, skeleton

    -- updated Update modal to match style of Create modal
    -- ran into small issue with CORS -> didn't realize DRF cares about trailing '/' for api url
        -- possible to turn off in settings, but I can just remember to include it
    -- updated json to account for optional values not being included
    
    OK let's look at spooky scary skeletons~~