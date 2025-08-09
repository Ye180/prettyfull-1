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

- [] Fix Build Errors due to fontvariable font.
