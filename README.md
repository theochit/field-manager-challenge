# Field Manager Challenge

# Development / Startup
- This project uses docker-compose, and can be built and run using `docker compose up --build`. The postgres db is not automatically created, and needs to be made first.
- No routes are available until you log in. There are two types of User: Landowner, such as a farmer, and a ChannelPartner, an internal manager of Landowners (ie, an Arva employee.)
-- You must register a ChannelPartner first, because Landowners require a ChannelPartner to register.
- Logged in as either role, you can go to the `/fields` route and add a field manually, or import a CSV of Fields. 
-- A Field's geometry must be a single GeoJSON Polygon Feature. An example csv is located in `field-manager-challenge/example_files`.
-- Note: Fields require a Landowner to be specified. If you want to import a CSV as a Landowner, make sure to set the id to that Landowner's id. 
- As a Landowner:
-- the `/fields` route will display only the Fields you own, which you can add to, edit, or delete.
-- Landowner's cannot see other Landowner's fields or ChannelPartner information.
- As a ChannelPartner:
-- Since a ChannelPartner manages Landowners, the `/fields` route will display the Fields belonging to the Landowners they manage. However, ChannelPartners can see all Landowner's details and their fields by going to the Landowners tab on the navbar (or by going to `/landowners/{id}/fields`). ChannelPartners have access to any Field in the `/fields/{id}` route.

# External packages used:
Backend:
- shapely, pyproj: For geometry operations, in this case to get the area of a geometry
Frontend:
- arcgis: For handling the map visualization
- geojson-validation: For validating submitted fields
- eslint: For consistent import structure and general linting

# Assumptions:
- A ChannelPartner is an internal manager of zero to many Landowners. ChannelPartners can see all resources.
- A Landowner has only one ChannelPartner managing them. Landowners can only see their own resources.
- A Field has only one Landowner. A field can only be a single GeoJSON Polygon Feature. 

# Improvements:
- For simplicity, both ChannelPartner and Landowner extend Django's built-in User model.
-- This provides free auth, but isn't bad for secure permissions. Permissions should be handled on the backend, but in this project, authorization to view certain resources is mainly handled on the frontend. The backend routes are open and do not require tokens. In a production setting, this would never be acceptable.
- Use something other than bootstrap for styling. I find bootstrap outdated but easy to get a project off the ground with. 