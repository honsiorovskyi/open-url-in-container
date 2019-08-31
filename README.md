# Open external links in a container

<img src="src/icons/extension-96.png">

This is a Firefox extension that enables support for opening links in specific containers using custom protocol handler. It works for terminal, OS shortcuts and regular HTML pages.

## Examples

Open `https://mozilla.org` in a container named `MyContainer`.

```
$ firefox 'ext+container:name=MyContainer&url=https://mozilla.org'
```

Open `https://mozilla.org` in a container named `MyContainer`. If the container doesn't exist, create it using an `orange` coloured `fruit` icon. Also, pin the tab.

```
$ firefox 'ext+container:name=MyContainer&color=orange&icon=fruit&url=https://mozilla.org&pinned=true'
```

Also it will work with the [links on the site](ext+container:name=MyContainer&url=https://mozilla.org):

```
<a href="ext+container:name=MyContainer&url=https://mozilla.org">Mozilla.Org in MyContainer</a>
```

## Build

### Step 1: Install node, npm, yarn
### Step 2:
```
$ git clone https://github.com/honsiorovskyi/open-url-in-container.git

$ cd open-url-in-container

$ yarn

$ yarn build
```

## License

[Mozilla Public License Version 2.0](LICENSE)

## Contibutions

Contibutions are very welcome. There's no specific process right now, just open your PRs/issues in this repo.