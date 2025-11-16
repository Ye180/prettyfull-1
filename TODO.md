- [] Complete the resolution of the Tailwindcss ui package
  > You could include in apps/user-app/app/globals.css:

@source "../../../node_modules/@repo/ui";
This tells Tailwind to scan the UI package files but exposes implementation details of turbo management.

Using a CSS @import
You could abstract the @source into the UI package's own CSS:

/_ packages/ui/styles.css _/
@source "./";
/_ packages/ui/package.json _/
"exports": {
…
"./styles.css": "./styles.css"
}
/_ apps/user-app/app/globals.css _/
@import "tailwindcss";
@import "@repo/ui/styles.css";
Little more complicated but more modular.

- [x] Fix Build Errors due to fontvariable font.
- [ ] Fix UI package imports (components in ui subolder it's not infer when importing)

## Backend

### Storage & File Management

- [x] Implement Storage Module for Garage S3-compatible uploads
  - [x] Configure AWS SDK v3 with S3Client
  - [x] Create StorageService with upload/delete methods
  - [x] Create StorageController with REST endpoints
  - [x] Add file validation (type, size, count)
  - [x] Configure Multer for multipart/form-data
  - [x] Add Swagger documentation
  - [x] Create comprehensive documentation (STORAGE_MODULE_GUIDE.md)
  - [x] Create test script (test-storage-upload.sh)
  - [x] Add environment variables to .env.example
  - [ ] Add authentication protection to upload endpoints
  - [ ] Implement image compression with Sharp
  - [ ] Add automatic thumbnail generation
  - [ ] Add file quotas per user
  - [ ] Integrate with ProductsModule for product images
  - [ ] Integrate with UsersModule for avatars
