# No-man's folly assets

## External assets
Some assets in this repository are from thrid parties and they are not under the license of No-man's folly project.

### AWS
Icon files in `assets/shapes/aws` are from:
https://aws.amazon.com/architecture/icons/

### Cisco
Icon files in `assets/shapes/cisco` are from:
https://www.cisco.com/c/en/us/about/brand-center/network-topology-icons.html

### Google Cloud
Icon files in `assets/shapes/gcp` are from:
https://cloud.google.com/icons


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

## Template SVGs
- Put icon files at `assets/templates` directory.
- Run `build.ts` to generate `index.json` that contains index information of templates.

```
$ deno run --allow-read --allow-write build.ts ./assets/templates/TARGET_DIRECTORY
```

- Directory structure is reflected to UI as it is.
- Although the script generates unique id for each icon, it's not so important as long as they are unique in each categories.

## Useful commands

Delete all files but `*.svg`
```
find ./assets/shapes/NAME -type f ! -name '*.svg' -exec rm -rf {} \;
```

## Local server
Use `http-server` or something.

```
npx http-server -p 8788 --cors ./assets/
```
