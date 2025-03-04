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

Denied : Look into best way to implement tagging system
DONE : Look into benefit of hyperlinking (performance)

--- At this point, basic API is set up for a few models

DONE : 
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

    DONE : work on fetching data from API to populate Items list https://nextjs.org/learn/dashboard-app/fetching-data

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

    DONE Tomorrow:
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
    DONE - Create Form

    DONE - Update Form
    DONE - Item Table Skeleton

    DONE - Details layout
    In Prog - Overall Page (especially when shrinking window)

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
    -- made it_skeleton.tsx for item table skeleton
        -- also made pit_skeleton for public table, to be used later but not important right now
    I don't think I need skeleton for anything else at the moment~

    ok so let me do a thing real quick with Food Location -- I want it to be based on existing Dining entries
        -- also include an "other", and prompt the creation of a Dining entry if it does not exist
        -- make the select searchable
        
1/30
    Took a break to prepare for an interview, back on the webdev flow
    So let's take a look at what's left to be done..
        -- details component layout format
        gg discovered issue with item table being at set width for larger screen sizes
        gg skeleton doesn't fully align with item table (mainly edges)
            -- skeleton shows up a bit too frequently, not sure if I want that
        gg Location not saving for Travel, Dining
        -- Form validation

    So let's start with Location not saving for Travel, Dining
        ++ changed condition of location in the payload for Create
        ++ updated Input elements in Create-Modal to use selectedLocation instead of location
        ++ updated instances of setLocation to setSelectedLocation to match Food category for Update-Modal

    Sick now let's look at our item table width
        -- Main div (item table's parent) used max-w-screen-lg --> changed to w-full, worked
        -- also updted New Entry button to have min width 160px and not break into 2 lines

    Sweet now to fix item table skeleton alignment
        -- Included parent div configuration of item table

    OK time to do some offline work -- let's draft some ideas for the detail component

    Next to work on tomorrow:
        -- Details component layout format
        -- Form validation + better error messages
            > would like to make input element red until it is fixed
            -- should start out neutral color, only turn red if user tries to submit
            -- On resubmit, check again and fix colors while remaining red for outstanding errors

        Error while selecting different categories in Create Modal:
        A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://react.dev/link/controlled-components
        -- tried to replicate but couldn't? i'll have to try again later 

1/31
    What's good chat, today let's work on...
        -- Details component layout format
        -- Improved form validation 
        -- investigate error regarding component being controlled / uncontrolled
            (potentially caused by changing categories)

    Details Layout
        -- implemented star rating system based on item.rating value (including partial stars)
        -- Finished initial draft of Details layouts -- have some stuff I want to change later, but this is good for now
        
2/4
    Ok, so let's take a look at
        -- improved form validation
            ++ client-side validation good
            .. DONE : server-side validation with DRF + front-end error handling
        -- create/update - controlled vs uncontrolled component
            >> Select option from cat 'Food'
            >> Switch category to 'Dining' or 'Travel', Location will maintain selected value
            >> Switch category to 'Music', and Artist will have location value
            ... if you go directly 'Food' to 'Music', artist will be cleared as expected
                therefore it must be an issue with Location setup
        -- images
        -- item table reloads after every action??
            .. should only do a full reload on page refresh?
            .. maybe need partial rendering / partial loading
        -- update sidenav to topnav only (currently depends on screen width)
            -- will have to adjust some other values for responsiveness of ui

    Sidenotes
        ++ added an error.tsx (currently modal) in app/
            ** keep it simple, single generic error modal for the entire app
        ++ fixed item table formatting to handle scrolling better
        ++ updated pagination formatting
            >> moved pagination logic to its own component
            >> moved item limit selection to same row as filter buttons 
        ** DONE : Make select options their own DB table instead of hardcoding
                -- Category, Location, Music Source, Cuisine

    Accessibility (+ input form validation)
        ++ tabIndex on interactable elements such as filter buttons
        ++ client-side validation : added "required" keyword to required inputs
        ** DONE : server-side validation
    
    Found bug where table scrollbar overlaps update/delete modals
        ++ adjusted z-index for each component to ensure proper stacking
    
2/5
    Today's focus:
    
    ++ server side input validation (DRF serialization, front end handling)
    ++ create/update modal : location input changing between controlled/uncontrolled
    -- images 
    -- update sidenav to topnav 
    -- limit item table api calls (partial rendering?)
    -- new database tables for select options (one table, fields: id, select_type, option_name)
    
    ++ updated DRF serialization to validate most fields
        -- excluding: id, cuisine TBD, music_meta
    ++ fixed location input and made sure select fields are properly reset on category change
        
2/6
    Today's focus:
        -- images 
        ++ update sidenav to topnav 
        -- limit item table api calls (partial rendering?)
        -- new database tables for select options (one table, fields: id, select_type, option_name)

    ++ update sidenav(conditional) to topnav(always) 
        >> made navbar more responsive to screen width
        >> hides links that don't fit, offers a "More" dropdown to show links that were hidden

    BUG / Warning :: 
    /home/tmkim/py_django/venv/venv_tcgbh/lib/python3.10/site-packages/rest_framework/pagination.py:207: UnorderedObjectListWarning: Pagination may yield inconsistent results with an unordered object_list: <class 'api_dank.models.Item'> QuerySet.
      paginator = self.django_paginator_class(queryset, page_size)

2/7
    Today's focus:
        -- images  
        -- limit item table api calls (partial rendering?)
        -- new database tables for select options (one table, fields: id, select_type, option_name)

    ** Had to deal with a quick bug regarding client hydration vs server-side rendering. Server-side was simply out of date after I made some changes to my html. Hard refreshing removed the error.

    OKKK now let's take a look at adding images to our website!

    -- We already added an upload button in our create/upload forms, but now we need to add some functionality!

2/8
    Alright so we're working on implementing Amazon AWS S3 today
    -- set up account, bucket, IAM user, user group (policies/permissions)
    -- stored access info in backend/.env, backend/settings.py, and frontend/.env.local
    -- set up views.py, urls.py, and upload.tsx

    -- I feel like I have everything set up properly, but I'm not seeing any files in my bucket.
    Going to do a refresh and try again.

2/10
    Today we're going to do some testing in a fresh git repos, fresh drf/next project to experiment with AWS.
    WOOOOOOOOOOOOOO
        Got it working on test app. Made it work here.
        Need to do some more cleanup and stuff, but at least I can successfully upload to my aws bucket.

2/11
    OK let's work on our images today!

    -- Make sure AWS image uploads are clean
    -- Image table, Item2Image table
    -- Items display in image carousel on details

    First let's clean up our backend and set up our tables
        ++ Image table set up (name, file, desc -- file is reference to S3 file)
        ++ Mock upload handles multiple images + descriptions

    Next, we add our upload component to our Create Modal
        ++ Restructured upload to pass file info up to create modal
        ++ Added logic in CM to handle file selection + descriptions
        ++ Updated handleSubmit to POST images to s3 only after the rest of the form is validated

2/12
    Today we will finish implementing item uploads and work on item display!

    Currently we can upload multiple items in our CreateModal
        -- Need to update our association table Image2Item 
            -> rename to ItemImages
            ++ updated view to accept bulk image upload (list of dicts)
            ++ successfully create item-image associations when creating a new item!
            ** restructured images to use item_id as foreign key instead of using assoc table

    Next we want to make sure our details are grabbing the correct images and displaying them
        ++ items are currently fetching appropriate images by item_id
        ~~ working on displaying images properly in carousel
        ?? not sure why but my frontend isn't loading
            -- changing port to 4000 made things load but wasn't retrieving anything from my backend? (items list was empty)

    Will look into what's going on with my port and frontend tomorrow.

    LATER: we want to make sure that we can update our images
        -- Update modal should pull the appropriate images and allow for change in name/desc
        -- Want to modify create modal to allow for name but prepop with filename
        
2/13
    Alright BOYS so no longer having issues with localhost:3000
    Not sure what happened but we ok for now, so let's see work on image carousel 

    Alright so i'm trying to use <Image> but it's being a bit weird.
    Essentially it's not showing the image. But I see my alt text.
    But the alt text is kind of being treated as a giant image that covers the whole page.

    ok sick got it working!
    Just had a thought -- if an item is deleted, corresponding images should be deleted too 
    ++ Done!!
    
    ++ made custom manage.py command to clear image table for cleanup
    ++ set up multi-delete for items for easy cleanup of test items

    TOMORROW : set up image editing in update-modal

2/17
    What's good fam, took a small break over the weekend but we're back in action 

    Let's see what we have left to do this week.
    1. Update images on Item Edit Form 
    2. Display image captions 
    3? database for select options?
    4? refactor backend to make it easier to add categories 
        -- right now need to add more fields to item table.. not the worst but not very clean
    5. Separate "public" vs "private" views 
        -- visitors shouldn't be able to add/edit/delete 
        -- but I don't want to make people log in to view, should be public access 
    6. Work on details formatting (mostly images)

    1. Update-modal images behavior:
        When modal is loaded, "selectedFiles" should include all images that are currently associated with the item
        User can either add new, edit existing, remove existing
        Add - append to current selectedFiles
        Edit - existing files appear as inputs, change as necessary
            .. have to keep track of image ID to edit proper row in db
        Delete - small X button with confirmation, remove from list

        onSubmit - compare new list of images with old list -- add new, edit changed, delete missing (+ delete from s3)

        ++ clicking Edit button will correctly populate image list
        -- Selecting new files clears list

        ** updated image upload to use a list of Image type instead of File type
        ** updated create-modal, tested that it works
        
2/18 continuing with image updates 
    
    ~ Working on API requests when update is submitted
        -- Delete removes from database but not s3
        -- Update not saving new info
        -- Add is not adding to either db or s3

        ** Update is working! Had to swap from PUT to PATCH
        ** Skip unchanged image is working!
        ** Add is working!
        ** Delete is working!
        ** Tested that it can do batch operations!

    2. Display image captions 
        -- added <p> and fixed alignment with image
        ** also fixed images to load faster using "eager" and preloading next/prev images.
    
2/19 
    Today we work on adding auth to separate Public vs Private 
    -- 99% of app will be public, and login is unnecessary 
    Login required for:
        Action buttons (add/edit/delete items)
        Multi-delete
    ^^ Mostly Done~~
        ** added authentication using rest_framework_simplejwt
        ** set up login page /login
        ** successfully hiding buttons based on login
    -- working on logout functionality, but running into hydration issues even after undoing my code...
    will have to look into this more later

2/20
    Alright so let's get started by looking into this hydration issue.
    It looks like the main issue is server HTML != client HTML
    So what's the issue here??
        -- confirmed there's no error on /dashboard or /login
        so it's specifically something on my items page.
    Ooohh ok. so there was an issue with how I was hiding components. It just didn't show as an issue during initial testing.
    Fixed the way that my pages/components check for JWT and how they hide links/components!

    Did some work updating UI. Also removed table skeleton because not really necessary.

    Discovered an interesting bug with pagination --
        Results are not always consistent with pagination. Going prev/next sometimes shows incorrect page of results.
        Clicking on one of the "incorrect" results updates results to show correct page.

2/23
    Alright today i'm going to update my database structure a bit and work on transitioning
        -- main thing is to split Item table into 1 Item table + Category detail tables (one table per category)
        goal is to make it easier to add new categories 
        .. this is kind of an "extra" feature but I think it will be worth doing 

    First let's make new models and views
    .. so I set up new models and started setting up new views/serializers
        but I took a bit of time to research.
        Apparently, it will be better to handle everything from a single API endpoint to keep things simple (less API overhead and front-end logic), and make sure that either both Item and CategoryTables are updated, or neither are.
        So we're going to update our Item ViewSet and Serializer to check the data's "category" field and handle each category appropriately.

    Random thought -- DONE: want to make my Item Table sortable !

2/24
    Ok let's continue our database refactor.

    ++ frontend/definitions_new.ts 
    ++ api_dank/newviews.py 
    ++ api_dank/newserializers.py 
    ++ api_dank/newmodels.py

    1 - Make sure backend is set up correctly
        > customize Item view to update multiple tables 
        >>> jk it looks like this is better handled in the Serializer
        ++ fixing up serializer validation to be more clean with helper class
        ++ custom Create, Read, and Update in serializer
        ++ custom Destroy in viewset
        ++ update delete_multiple in viewset

    2 - Set up frontend to handle new backend 
        ~ create-modal
        ~ update-modal
        ~ item-table
        ~ detail
        ~ multi-delete (?)

    3 - Flip the switch ~
        .. make sure to create separate branch first!

2/25
    Today we work on our front end! We will see how far we can go without flipping the switch, then do further debugging after
    Trying to debug in the middle will be kinda inefficient because obviously things won't work until they're fixed.

    Let's start simple with our GET ops (detail, item-table)
        + newtable.tsx
            .. actually we aren't using any category details at this point, so this can stay the same
        + newdetails.tsx
            - added category_data definition to item
            - replaced item.attr with item.category_data.attr
                (only for category attributes)
        + newcreate.tsx
            - added category_data to handleSubmit payload
            - moved location from payload to category_data
            - updated music source (select) -> source (text)
            ***** removed ~potentially redundant~ "images" from payload
            ^^^ might want to move image upload into item serializer
        + newupdate.tsx
            - similar to newcreate changes

    Ok so now we make a new branch and try changing things over 
    -- make backup files of old version 
    -- rename new files to replace old 
    -- migrate database changes

    TEST : 
        - View item details
        - Create new item (one of each category)
        - Edit existing item (one of each category)
        - Delete existing item (one of each category)


    ISSUES : 
        - Created dining entry, item table updated, category table is not
            ^ same with food, media, travel
            - confirmed category_data is in payload
            - confirmed category_data empty in serializer
            *** Data is now properly stored in category tables!

        - Issue retrieving category_data in Details component
        - Issue retrieving category_data in Item Update 
        - Issue retrieving category_data in Item Delete 
        - Item table query/filter not working

        So the core issue here right now is retrieving category_data

2/26
    Today we shall make sure that our new data retrieval is good
    
    + updated models to use OneToOneField instead of ForeignKey
        > fixed Details, Update, Delete

    Issues : 
            ** FIXED    Dining edit - missing Location, 
            ** FIXED        Website
            ** FIXED    > also missing in DB -> issue with create

            ** FIXED    Food - "Dining" option lists all items as options
            ** FIXED    "Other" location saves properly, not retrieved properly

            ** FIXED Media edit - missing Genre, Website 
            ** FIXED    > also missing in DB -> issue with create

            ** FIXED    Travel edit - missing Location
            ** FIXED         Website
            ** FIXED    > also missing in DB -> issue with create

            ** FIXED - Details - media not showing artist but update shows in db
        
    + Confirmed images are still working as expected

    I believe refactor has been completed!

2/27
    Today we're going to improve our Select options
    + new SelectOption model - ID, Category, Name
    + Creating Dining/Travel adds new Location
    + Creating Food with "Other" adds new Location
    + Creating Media with "Other" adds new Source
    + Updating Food/Media with "Other" adds new location/source
    + Updating Dining/Travel name updates select option
        + Also updates food location
    + Location Select populated via SelectOption fetch
    + Source Select populated via SelectOption fetch
    + Unused Select Options are deleted

2/28
    Alright, doing some final touches, making sure we did everything we wanted TODO.

    1. Make Item Table sortable 
        + added state to handle sort key + order
        + added function to sort results
        + added function to display sort arrow
        + added style to header titles

    2. Improve Details layout
        + improve spacing
        + improve links
        + improve images
            > clicking on image now opens a full screen modal 
            > fixed aspect ratio of non-modal images as well
    
    3. Issue with updating results 
        > When I go to page 2, it will load page 2 result then overwrite with page 1 results
            + added check to ensure page state is updated properly
        > If I'm on page 2 and click a filter, there's an error if that filter doesn't have enough pages
            + reset page to '1' on filter click
        *** New Bug ***
        Basically there is an issue with the "Categories" dependency because it is an array and array is being re-created each render, so useEffect is running too many times
        FIXED -- updated how "categories" are stored -> using a dictionary to track true/false rather than an array
            ( was already kinda doing this, but built an array before sending to Item Table. Now we're just sending the dictionary.)
        
3/3
    OK so today we're trying to set up everything using Docker
    -- made Dockerfile for backend and frontend separate
    -- running into issue with npm run build for frontend
        -- need suspense around useSearchParams()
        ++ updated layout.tsx to wrap {children} with <Suspense>

    Some success with making docker images and containers
        -- able to see frontend work correctly
        -- backend wasn't running properly, something about gunicorn?
        -- was taking up a lot of space on my hard drive so had to purge data and try to reset in case space was causing issues with installs
        