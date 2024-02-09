# No-man's folly assets

## Setup
Install Deno: https://docs.deno.com/runtime/manual

## External icons
- Put icon files at `assets/shapes` directory.
- Run `build.ts` to generate `index.json` that contains index information of icons.

```
$ deno run --allow-read --allow-write build.ts ./assets/shapes/TARGET_DIRECTORY
```

- Directory structure is reflected to UI as it is.
- The script generates unique id for each icon. Those ids change every time it runs.
