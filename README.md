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

## build.ts
Run `build.ts` to generate `index.json` for a target directory:

```
$ deno run --allow-read --allow-write --allow-run build.ts ./assets/TARGET_DIRECTORY
```

- Directory structure is reflected to UI as it is.
- A unique id is generated for each file. Ids are stable across runs — only new or modified files get a new id (detected via `git status`).

### meta.json
The script also maintains a `meta.json` alongside `index.json`:

- New files are added with an empty tag list.
- Existing entries (and their tags) are preserved.
- Removed files are dropped.

Pass `--no-meta` to skip updating `meta.json`:

```
$ deno run --allow-read --allow-write --allow-run build.ts ./assets/TARGET_DIRECTORY --no-meta
```

## External icons
Put icon files under `assets/shapes` and run `build.ts` with `--no-meta`:

```
$ deno run --allow-read --allow-write --allow-run build.ts ./assets/shapes/TARGET_DIRECTORY --no-meta
```

## Template SVGs
Put template files under `assets/templates` and run `build.ts`:

```
$ deno run --allow-read --allow-write --allow-run build.ts ./assets/templates/TARGET_DIRECTORY
```

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
