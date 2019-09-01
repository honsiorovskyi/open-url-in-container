# Open external links in a container

<img src="src/icons/extension-96.png">

This is a Firefox extension that enables support for opening links in specific containers using custom protocol handler. It works for terminal, OS shortcuts and regular HTML pages.

## Examples

Open `https://mozilla.org` in a container named `MyContainer`.

```bash
$ firefox 'ext+container:name=MyContainer&url=https://mozilla.org'
```

Open `https://mozilla.org` in a container named `MyContainer`. If the container doesn't exist, create it using an `orange` coloured `fruit` icon. Also, pin the tab.

```bash
$ firefox 'ext+container:name=MyContainer&color=orange&icon=fruit&url=https://mozilla.org&pinned=true'
```

Also it will work with the [links on the site](ext+container:name=MyContainer&url=https://mozilla.org):

```html
<a href="ext+container:name=MyContainer&url=https://mozilla.org">Mozilla.Org in MyContainer</a>
```

## Launcher

Shell launcher provides a shortcut for opening links in a more user-friendly and unix-style way.

```
$ firefox-container --help

Usage:

firefox-container [COLOR] [ICON] [-n|--name NAME|--name=NAME] URL
firefox-container URL [COLOR] [ICON] [-n|--name NAME|--name=NAME]
firefox-container -h|--help

Where COLOR is one of:
	--blue
	--turquoise
	--green
	--yellow
	--orange
	--red
	--pink
	--purple

Where ICON is one of:
	--fingerprint
	--briefcase
	--dollar
	--cart
	--circle
	--gift
	--vacation
	--food
	--fruit
	--pet
	--tree
	--chill

If container NAME is not supplied, the domain part of URL will be used as NAME instead.
```

### Installation example

```bash
$ curl -sL https://github.com/honsiorovskyi/open-url-in-container/raw/master/launcher.sh | sudo tee /usr/bin/firefox-container > /dev/null
$ sudo chmod 0755 /usr/bin/firefox-container
```

## Build

### Step 1: Install node, npm, yarn
### Step 2:
```bash
$ git clone https://github.com/honsiorovskyi/open-url-in-container.git

$ cd open-url-in-container

$ yarn

$ yarn build
```

## License

[Mozilla Public License Version 2.0](LICENSE)

## Contibutions

Contibutions are very welcome. There's no specific process right now, just open your PRs/issues in this repo.
