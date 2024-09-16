# Field Manager Challenge

## Development / Startup

This project is built using `docker-compose`. Follow the steps below to get started:

1. **Build and Run:**
   - Run the project using the command:
     ```bash
     docker compose up --build
     ```
   - **Note:** The PostgreSQL database is **not** automatically created. You'll need to create it manually before running the application.
   - The frontend defaults to ```localhost:3000``` and the backend defaults to ```localhost:8000```

2. **User Types:**
   - There are two roles in the system:
     - Landowner: Typically a farmer or landholder.
     - ChannelPartner: Internal managers responsible for overseeing Landowners (e.g., an Arva employee).
   - **Note:** You must register a ChannelPartner first. Landowners require a ChannelPartner to complete their registration.
   - No routes are available until a user logs in.

---

### Field Management Features

- Logged in as either role, you can access the `/fields` route to:
  - Add a field manually.
  - Import a CSV of Fields.
  
- **Field Geometry Requirements:**
  - The geometry must be a single **GeoJSON Polygon Feature**.
  - Example CSV files are provided in the `field-manager-challenge/example_files` folder.

- **Landowner Specifics:**
  - As a Landowner, the `/fields` route only displays your fields. You can add, edit, or delete fields.
  - Landowners cannot view other Landowners’ fields or see ChannelPartner information.

- **ChannelPartner Specifics:**
  - As a ChannelPartner, the `/fields` route displays fields belonging to the Landowners you manage.
  - ChannelPartners can view all Landowners and their details via the Landowners tab in the navbar or directly by visiting `/landowners/{id}/fields`.
  - ChannelPartners can access any field by navigating to `/fields/{id}`.

---

## External Packages Used

### Backend:
- **Shapely, pyproj:** Used for geometry operations, this case just calculating the area of a geometry.

### Frontend:
- **ArcGIS:**  Handles map visualization and renders field geometries.
- **GeoJSON-validation:** Validates submitted fields for correctness and format.
- **ESLint:** Ensures consistent code style and import structure across the frontend.

---

## Key Assumptions

- **ChannelPartner:** A ChannelPartner is responsible for managing zero to many Landowners. They have visibility and access to all resources within the system.
  
- **Landowner:** A Landowner can have only one ChannelPartner managing them. Landowners can only view and manage their own resources (fields).

- **Field:** A field is owned by one Landowner and its `geometry` must be represented as a single GeoJSON Polygon Feature.

---

## Possible Improvements

1. **Extending Django’s User Model:**
   - Both ChannelPartner and Landowner roles extend Django's built-in `User` model. While this provides built-in authentication, it's not an ideal approach for **secure permissions**. Backend permission handling should be improved to ensure better control over resources.

2. **Authorization Handling:**
   - Currently, authorization to view resources is handled on the frontend. The backend routes are open and do not require tokens. This approach is not suitable for production environments. Proper token-based authentication should be enforced on the backend.

3. **Structured Error Handling:**
   - Perhaps using more generic error components.

4. **Styling:**
   - Bootstrap is used for styling in this project, but it feels outdated. It’s a quick solution for getting the project off the ground, but in my experience, is not the easiest to customize.
   