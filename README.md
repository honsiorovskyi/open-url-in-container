# Open external links in a container

<img src="src/icons/extension-96.png">

This is a Firefox extension that enables support for opening links in specific containers using custom protocol handler. It works for terminal, OS shortcuts and regular HTML pages.

An extension can be installed from the [official Mozilla Add-Ons Store for Firefox](https://addons.mozilla.org/firefox/addon/open-url-in-container/).

## Features

- provides custom protocol handler to open URLs in containers
- supports both command line and internal invocations
- supports creation of containers on the fly
- supports setting colors and icons when creating new containers
- supports tabs pinning
- supports opening tabs in reader mode
- works well in combination with other extensions

## Examples

Open `https://mozilla.org` in a container named `MyContainer`.

```bash
$ firefox 'ext+container:name=MyContainer&url=https://mozilla.org'
```

Open `https://mozilla.org` in a container named `MyContainer`. If the container doesn't exist, create it using an `orange` colored `fruit` icon. Also, pin the tab.

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
firefox-container - open URL in a specific container in Firefox.

Usage:
	firefox-container [OPTIONS] URL
	firefox-container URL [OPTIONS]
	firefox-container -h|--help

Where optional OPTIONS may include any combination of:
	--COLOR		color for the container (if does not exist)
	--ICON		icon for the container (if does not exist)
  -n,	--name=NAME	container name (default: domain part of the URL)
  -p,	--pin		pin tab
  -r,	--reader	open tab in the reader mode

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
