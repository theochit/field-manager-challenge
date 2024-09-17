# Arva Field Manager Challenge

## Development / Getting Started

1. **Build and Run:**
   This project is built using `docker-compose`.
   - Run the project using the command:
     ```
     docker compose up --build
     ```
   - **Note:** The PostgreSQL database is **not** automatically created. You'll need to create it manually before running the application.
   - The frontend defaults to ```localhost:3000``` and the backend defaults to ```localhost:8000```

2. **User Types:**
   - There are two roles in the system:
     - Landowner: Typically a farmer.
     - ChannelPartner: Internal managers responsible for overseeing Landowners (e.g., an Arva employee).
   - **Note:** You must register a ChannelPartner first. Landowners require a ChannelPartner to complete their registration.
   - No routes are available until a user logs in.

---

### Field Management Features

- **ChannelPartner Specifics:**
  - A ChannelPartner is responsible for managing zero to many Landowners. They have read and write access to all resources within the system.    
  - As a ChannelPartner, the `/fields` route displays fields belonging to the Landowners you manage.
  - ChannelPartners can view all Landowners and their details via the Landowners tab in the navbar or directly by visiting `/landowners/{id}/fields`.
  - ChannelPartners can access any field by navigating to `/fields/{id}`.
   
- **Landowner Specifics:**
  - A Landowner can have only one ChannelPartner managing them. Landowners can only view, add, edit and delete their own Fields.
  - As a Landowner, the `/fields` route only displays your fields. You can add, edit, or delete fields.
  - Landowners cannot view other Landowners’ fields or see ChannelPartner information.

- Logged in as either role, you can access the `/fields` route to:
  - Add a field manually.
  - Import a CSV of Fields.
  
- **Field Geometry Requirements:**
  - The geometry must be a single **GeoJSON Polygon Feature**.
  - Example CSV files are provided in the `field-manager-challenge/example_files` folder.

---

## External Packages Used

- **Docker**: To containerize the app and make local development / deployment easier.

### Backend:
- **Shapely, pyproj:** Used for geometry operations, this case just calculating the area of a geometry.

### Frontend:
- **ArcGIS:**  Handles map visualization and renders field geometries.
- **GeoJSON-validation:** Validates submitted fields for correctness and format.
- **ESLint:** Ensures consistent code style and import structure across the frontend.

---

## Room for Improvement
1. **Typing:** Use Typescript instead of JS for typing, since react-props is outdated and clunky.

2. **Authorization Handling:**
   - Both ChannelPartner and Landowner roles extend Django's built-in `User` model. This provides free authentication, but it's not an ideal approach for secure permissions. Proper token-based authentication should be enforced on the backend.
   - Currently, authorization to view resources is handled on the frontend. The backend routes are open and do not require tokens, for ease of development and demos. This approach is not suitable for production.

3. **Structured Error Handling:** Perhaps using more generic error components.

4. **Styling:** Bootstrap is used for styling in this project, but it feels outdated. It’s a quick solution for getting the project off the ground, but in my experience, is not the easiest to customize.

5. **GeoJSON Support:** Add support for all GeoJSON types. Currently only Polygon is accepted. 
   
